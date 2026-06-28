const { query, run } = require('../database/db');

// ── Achievement definitions ──────────────────────────────────

const ACHIEVEMENT_CHECKS = [
    {
        id: 'first_feed',
        label: 'Alimentaste a Chiikawa',
        condition: (ctx) => ctx.action === 'feed',
    },
    {
        id: 'first_play',
        label: 'Jugaste con Chiikawa',
        condition: (ctx) => ctx.action === 'play',
    },
    {
        id: 'first_pet',
        label: 'Acariciaste a Chiikawa',
        condition: (ctx) => ctx.action === 'pet',
    },
    {
        id: 'first_sleep',
        label: 'Chiikawa durmió',
        condition: (ctx) => ctx.action === 'sleep',
    },
    {
        id: 'full_happiness',
        label: '¡Felicidad máxima!',
        condition: (ctx) => ctx.happiness >= 100,
    },
    {
        id: 'full_hunger',
        label: '¡Pancita llena!',
        condition: (ctx) => ctx.hunger >= 100,
    },
    {
        id: 'full_sleep',
        label: '¡Bien descansado!',
        condition: (ctx) => ctx.sleep >= 100,
    },
    {
        id: 'all_max',
        label: '¡Chiikawa perfecto!',
        condition: (ctx) => ctx.happiness >= 100 && ctx.hunger >= 100 && ctx.sleep >= 100,
    },
    {
        id: 'hearts_10',
        label: '10 corazones ❤️',
        condition: (ctx) => ctx.totalHearts >= 10,
    },
    {
        id: 'hearts_50',
        label: '50 corazones 💖',
        condition: (ctx) => ctx.totalHearts >= 50,
    },
    {
        id: 'hearts_100',
        label: '100 corazones 💝',
        condition: (ctx) => ctx.totalHearts >= 100,
    },
    {
        id: 'streak_3',
        label: '3 días seguidos 🔥',
        condition: (ctx) => ctx.consecutiveDays >= 3,
    },
    {
        id: 'streak_7',
        label: '¡Una semana! 🌟',
        condition: (ctx) => ctx.consecutiveDays >= 7,
    },
];

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

        // 3. Persist degraded stats, streak, visit counter, and connection time
        await run(
            `UPDATE user_profile SET
                visits = visits + 1,
                last_connection = datetime('now'),
                happiness = ?,
                hunger = ?,
                sleep = ?,
                consecutive_days = ?,
                last_visit_date = ?
             WHERE id = 1`,
            [state.happiness, state.hunger, state.sleep, streak, today]
        );

        // 4. Parse JSON fields for the response
        state.unlocked_letters       = JSON.parse(state.unlocked_letters      || '[]');
        state.viewed_songs           = JSON.parse(state.viewed_songs          || '[]');
        state.unlocked_achievements  = JSON.parse(state.unlocked_achievements || '[]');
        state.found_easter_eggs      = JSON.parse(state.found_easter_eggs     || '[]');

        res.json({ success: true, data: state });
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
                    total_hearts, consecutive_days
             FROM user_profile WHERE id = 1`
        );

        let { happiness, hunger, sleep, unlocked_achievements, total_hearts, consecutive_days } = state;
        unlocked_achievements = JSON.parse(unlocked_achievements || '[]');
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

        for (const achv of ACHIEVEMENT_CHECKS) {
            if (!unlocked_achievements.includes(achv.id) && achv.condition(ctx)) {
                unlocked_achievements.push(achv.id);
            }
        }

        // Persist
        await run(
            `UPDATE user_profile SET
                happiness = ?,
                hunger = ?,
                sleep = ?,
                unlocked_achievements = ?,
                total_hearts = ?,
                last_connection = datetime('now')
             WHERE id = 1`,
            [happiness, hunger, sleep, JSON.stringify(unlocked_achievements), total_hearts]
        );

        res.json({
            success: true,
            message: `Action "${action}" completed`,
            stats: { happiness, hunger, sleep },
            animation: animationTrigger,
            dialogue,
            achievements: unlocked_achievements,
            totalHearts: total_hearts,
        });
    } catch (error) {
        console.error('performAction error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
