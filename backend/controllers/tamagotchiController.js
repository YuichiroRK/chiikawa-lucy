const { query, run } = require('../database/db');

// ── Achievement definitions ──────────────────────────────────

const ACHIEVEMENT_CHECKS = [
    {
        id: 'ach-first-feed',
        label: 'Alimentaste a Chiikawa',
        condition: (ctx) => ctx.action === 'feed',
    },
    {
        id: 'ach-first-play',
        label: 'Jugaste con Chiikawa',
        condition: (ctx) => ctx.action === 'play',
    },
    {
        id: 'ach-first-pet',
        label: 'Acariciaste a Chiikawa',
        condition: (ctx) => ctx.action === 'pet',
    },
    {
        id: 'ach-first-sleep',
        label: 'Chiikawa durmió',
        condition: (ctx) => ctx.action === 'sleep',
    },
    {
        id: 'ach-max-happiness',
        label: '¡Felicidad máxima!',
        condition: (ctx) => ctx.happiness >= 100,
    },
    {
        id: 'ach-streak-3',
        label: '3 días seguidos 🔥',
        condition: (ctx) => ctx.consecutiveDays >= 3,
    },
    {
        id: 'ach-streak-7',
        label: '¡Una semana! 🌟',
        condition: (ctx) => ctx.consecutiveDays >= 7,
    },
];

const ACHIEVEMENT_ID_ALIASES = {
    first_feed: 'ach-first-feed',
    first_play: 'ach-first-play',
    first_pet: 'ach-first-pet',
    first_sleep: 'ach-first-sleep',
    full_happiness: 'ach-max-happiness',
    streak_3: 'ach-streak-3',
    streak_7: 'ach-streak-7',
};
const KNOWN_ACHIEVEMENT_IDS = new Set([
    ...ACHIEVEMENT_CHECKS.map(({ id }) => id),
    'ach-first-visit', 'ach-all-actions', 'ach-read-letter',
    'ach-all-songs', 'ach-easter-egg', 'ach-night-owl',
    'ach-theme-change', 'ach-konami', 'ach-secret-zone',
]);

function parseJsonArray(value) {
    try {
        const parsed = JSON.parse(value || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function normalizeAchievementIds(value) {
    return [...new Set(parseJsonArray(value)
        .map((id) => ACHIEVEMENT_ID_ALIASES[id] || id)
        .filter((id) => KNOWN_ACHIEVEMENT_IDS.has(id)))];
}

function progressResponse(state) {
    const timestamp = state.last_connection || new Date().toISOString();
    return {
        letters: parseJsonArray(state.unlocked_letters).map((id) => ({ id, unlockedAt: timestamp })),
        songs: parseJsonArray(state.viewed_songs).map((id) => ({ id, viewedAt: timestamp })),
        achievements: parseJsonArray(state.unlocked_achievements).map((id) => ({ id, unlockedAt: timestamp })),
        easterEggs: parseJsonArray(state.found_easter_eggs).map((id) => ({ id, foundAt: timestamp })),
        theme: state.active_theme === 'default' ? 'theme-default' : state.active_theme,
        visitCount: state.visits || 0,
        firstVisit: state.created_at || timestamp,
        lastVisit: state.last_visit_date || timestamp,
    };
}

// ── Helpers ──────────────────────────────────────────────────

/** Clamp a number between min and max */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Calculate stat degradation based on hours elapsed since last connection.
 * Each hour offline reduces each stat by 2 (minimum 0).
 */
function degradeStats(state) {
    if (!state.last_connection) return state;

    const lastConn = new Date(state.last_connection + 'Z'); // stored as UTC
    const now = new Date();
    const hoursElapsed = Math.floor((now - lastConn) / (1000 * 60 * 60));

    if (hoursElapsed > 0) {
        const decay = hoursElapsed * 5;
        state.happiness = clamp(state.happiness - decay, 0, 100);
        state.hunger    = clamp(state.hunger - decay, 0, 100);
        state.sleep     = clamp(state.sleep - decay, 0, 100);
    }
    return state;
}

/**
 * Update consecutive_days streak.
 * Returns the new streak value.
 */
function calculateStreak(lastVisitDate, consecutiveDays) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (!lastVisitDate) {
        return { streak: 1, today };
    }

    if (lastVisitDate === today) {
        // Same day – streak unchanged
        return { streak: consecutiveDays, today };
    }

    // Check if last visit was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastVisitDate === yesterdayStr) {
        return { streak: consecutiveDays + 1, today };
    }

    // Gap of more than 1 day – reset streak
    return { streak: 1, today };
}

// ── GET /tamagotchi/status ───────────────────────────────────

exports.getStatus = async (req, res) => {
    try {
        let state = await query(`SELECT * FROM user_profile WHERE id = 1`);

        if (!state) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        // 1. Degrade stats based on time offline
        state = degradeStats(state);

        // 2. Update streak
        const { streak, today } = calculateStreak(
            state.last_visit_date,
            state.consecutive_days || 0
        );
        state.consecutive_days = streak;
        state.last_visit_date = today;

        // 3. Unlock visit/streak achievements and eligible letters before persisting.
        let achievements = normalizeAchievementIds(state.unlocked_achievements);
        const achievementContext = {
            consecutiveDays: streak,
            happiness: state.happiness,
            hunger: state.hunger,
            sleep: state.sleep,
        };
        for (const achievement of ACHIEVEMENT_CHECKS) {
            if (!achievements.includes(achievement.id) && achievement.condition(achievementContext)) {
                achievements.push(achievement.id);
            }
        }
        if (!achievements.includes('ach-first-visit')) achievements.push('ach-first-visit');

        let letters = parseJsonArray(state.unlocked_letters);
        if (!letters.includes('letter-1')) letters.push('letter-1');
        if (streak >= 3 && !letters.includes('letter-2')) letters.push('letter-2');
        if (achievements.length >= 5 && !letters.includes('letter-3')) letters.push('letter-3');
        if (state.secret_zone_unlocked && !letters.includes('letter-secret')) letters.push('letter-secret');

        // 4. Persist degraded stats, streak, visit counter, and connection time
        await run(
            `UPDATE user_profile SET
                visits = visits + 1,
                last_connection = datetime('now'),
                happiness = ?,
                hunger = ?,
                 sleep = ?,
                 consecutive_days = ?,
                 last_visit_date = ?,
                 unlocked_achievements = ?,
                 unlocked_letters = ?
              WHERE id = 1`,
            [state.happiness, state.hunger, state.sleep, streak, today,
                JSON.stringify(achievements), JSON.stringify(letters)]
        );

        // 5. Return the frontend's canonical progress shape.
        state.visits = (state.visits || 0) + 1;
        state.last_visit_date = today;
        state.unlocked_letters = JSON.stringify(letters);
        state.unlocked_achievements = JSON.stringify(achievements);

        res.json({ success: true, data: {
            happiness: state.happiness,
            hunger: state.hunger,
            sleep: state.sleep,
            mood: state.mood || 'neutral',
            progress: progressResponse(state),
        }});
    } catch (error) {
        console.error('getStatus error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── POST /tamagotchi/action ──────────────────────────────────

exports.performAction = async (req, res) => {
    const { action } = req.body;

    if (!action) {
        return res.status(400).json({ success: false, message: 'Action is required' });
    }

    try {
        const state = await query(
            `SELECT happiness, hunger, sleep, unlocked_achievements,
                    unlocked_letters, total_hearts, consecutive_days
             FROM user_profile WHERE id = 1`
        );

        let { happiness, hunger, sleep, unlocked_achievements, unlocked_letters, total_hearts, consecutive_days } = state;
        unlocked_achievements = normalizeAchievementIds(unlocked_achievements);
        unlocked_letters = parseJsonArray(unlocked_letters);
        total_hearts = total_hearts || 0;
        consecutive_days = consecutive_days || 0;

        let animationTrigger = 'idle';
        let dialogue = '¡Haaai! ✨';

        switch (action) {
            case 'feed':
                hunger    = clamp(hunger + 20, 0, 100);
                happiness = clamp(happiness + 5, 0, 100);
                animationTrigger = 'happy';
                dialogue = '¡Mogu mogu! 🍓';
                break;
            case 'play':
                happiness = clamp(happiness + 25, 0, 100);
                hunger    = clamp(hunger - 15, 0, 100);
                sleep     = clamp(sleep - 10, 0, 100);
                animationTrigger = 'play';
                dialogue = '¡Yaah! 🎒🌟';
                break;
            case 'sleep':
                sleep     = clamp(sleep + 40, 0, 100);
                hunger    = clamp(hunger - 10, 0, 100);
                animationTrigger = 'sleep';
                dialogue = 'Fuu... Zzz 💤';
                break;
            case 'pet':
                happiness = clamp(happiness + 15, 0, 100);
                animationTrigger = 'love';
                dialogue = '¡Uraaa! 🥰🌸';
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid action' });
        }

        // Increment total hearts
        total_hearts += 1;

        // Auto-unlock achievements
        const ctx = {
            action,
            happiness,
            hunger,
            sleep,
            totalHearts: total_hearts,
            consecutiveDays: consecutive_days,
        };

        // A streak is evaluated on status visits, but action-triggered checks
        // still use the current stored value and are persisted atomically here.

        for (const achv of ACHIEVEMENT_CHECKS) {
            if (!unlocked_achievements.includes(achv.id) && achv.condition(ctx)) {
                unlocked_achievements.push(achv.id);
            }
        }

        if (unlocked_achievements.length >= 5 && !unlocked_letters.includes('letter-3')) {
            unlocked_letters.push('letter-3');
        }

        // Persist
        await run(
            `UPDATE user_profile SET
                happiness = ?,
                hunger = ?,
                sleep = ?,
                unlocked_achievements = ?,
                unlocked_letters = ?,
                total_hearts = ?,
                last_connection = datetime('now')
             WHERE id = 1`,
            [happiness, hunger, sleep, JSON.stringify(unlocked_achievements),
                JSON.stringify(unlocked_letters), total_hearts]
        );

        res.json({
            success: true,
            message: `Action "${action}" completed`,
            stats: { happiness, hunger, sleep },
            animation: animationTrigger,
            dialogue,
            achievements: unlocked_achievements,
            unlockedLetters: unlocked_letters,
            totalHearts: total_hearts,
        });
    } catch (error) {
        console.error('performAction error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
