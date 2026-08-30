const { query, run, recordEvent } = require('../database/db');

const KNOWN_IDS = {
    letters: new Set(['letter-1', 'letter-2', 'letter-3', 'letter-4', 'letter-5', 'letter-6', 'letter-secret']),
    songs: new Set(Array.from({ length: 8 }, (_, index) => `song-${index + 1}`)),
    achievements: new Set([
        'ach-first-visit', 'ach-first-feed', 'ach-first-play', 'ach-first-sleep', 'ach-first-pet',
        'ach-max-happiness', 'ach-all-actions', 'ach-streak-3', 'ach-streak-7', 'ach-read-letter',
        'ach-all-songs', 'ach-easter-egg', 'ach-konami', 'ach-night-owl', 'ach-secret-zone',
        'ach-theme-change', 'ach-hearts-10', 'ach-hearts-50', 'ach-hearts-100', 'ach-perfect-care',
    ]),
    easterEggs: new Set(['ee-konami', 'ee-secret-word', 'ee-click-10', 'ee-witching-hour', 'ee-valentines']),
};

// ── Helpers ──────────────────────────────────────────────────

/**
 * Safely parse a JSON array column. Returns [] on any failure.
 */
function parseJsonArray(value) {
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function validateId(value, field) {
    if (typeof value !== 'string' || !/^[a-z0-9-]{1,64}$/i.test(value)) {
        return { success: false, message: `${field} must contain only letters, numbers and hyphens` };
    }
    return null;
}

function validateKnownId(value, field, type) {
    return KNOWN_IDS[type].has(value) ? null : { success: false, message: `Unknown ${field}` };
}

/**
 * Add an item to a JSON-array column if not already present.
 * Returns { updated: boolean, list: string[] }
 */
let progressWriteQueue = Promise.resolve();

function addToJsonArrayColumn(column, itemId) {
    const operation = progressWriteQueue.then(async () => {
        const state = await query(`SELECT ${column} FROM user_profile WHERE id = 1`);
        if (!state) throw new Error('User profile not found');

        const list = parseJsonArray(state[column]);
        if (list.includes(itemId)) return { updated: false, list };

        list.push(itemId);
        await run(`UPDATE user_profile SET ${column} = ? WHERE id = 1`, [JSON.stringify(list)]);
        return { updated: true, list };
    });
    progressWriteQueue = operation.catch(() => undefined);
    return operation;
}

// ── POST /progress/letters/unlock ────────────────────────────

exports.unlockLetter = async (req, res) => {
    const { letterId } = req.body;

    if (!letterId) {
        return res.status(400).json({ success: false, message: 'letterId is required' });
    }
    const invalid = validateId(letterId, 'letterId');
    if (invalid) return res.status(400).json(invalid);
    const unknown = validateKnownId(letterId, 'letterId', 'letters');
    if (unknown) return res.status(400).json(unknown);

    try {
        const { updated, list } = await addToJsonArrayColumn('unlocked_letters', letterId);
        if (updated) await recordEvent('letter_unlocked', letterId);

        res.json({
            success: true,
            alreadyUnlocked: !updated,
            unlockedLetters: list,
        });
    } catch (error) {
        console.error('unlockLetter error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── POST /progress/songs/view ────────────────────────────────

exports.viewSong = async (req, res) => {
    const { songId } = req.body;

    if (!songId) {
        return res.status(400).json({ success: false, message: 'songId is required' });
    }
    const invalid = validateId(songId, 'songId');
    if (invalid) return res.status(400).json(invalid);
    const unknown = validateKnownId(songId, 'songId', 'songs');
    if (unknown) return res.status(400).json(unknown);

    try {
        const { updated, list } = await addToJsonArrayColumn('viewed_songs', songId);
        if (updated) await recordEvent('song_viewed', songId);
        let unlockedAchievements;
        let unlockedLetters;

        if (list.length >= 8) {
            const state = await query(`SELECT unlocked_achievements, unlocked_letters FROM user_profile WHERE id = 1`);
            const achievements = parseJsonArray(state.unlocked_achievements);
            const letters = parseJsonArray(state.unlocked_letters);
            if (!achievements.includes('ach-all-songs')) achievements.push('ach-all-songs');
            if (!letters.includes('letter-6')) letters.push('letter-6');
            unlockedAchievements = achievements;
            unlockedLetters = letters;
            await run(
                `UPDATE user_profile SET unlocked_achievements = ?, unlocked_letters = ? WHERE id = 1`,
                [JSON.stringify(achievements), JSON.stringify(letters)]
            );
        }

        res.json({
            success: true,
            alreadyViewed: !updated,
            viewedSongs: list,
            unlockedAchievements,
            unlockedLetters,
        });
    } catch (error) {
        console.error('viewSong error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── POST /progress/achievements/unlock ───────────────────────

exports.unlockAchievement = async (req, res) => {
    const { achievementId } = req.body;

    if (!achievementId) {
        return res.status(400).json({ success: false, message: 'achievementId is required' });
    }
    const invalid = validateId(achievementId, 'achievementId');
    if (invalid) return res.status(400).json(invalid);
    const unknown = validateKnownId(achievementId, 'achievementId', 'achievements');
    if (unknown) return res.status(400).json(unknown);

    try {
        const { updated, list } = await addToJsonArrayColumn('unlocked_achievements', achievementId);
        if (updated) await recordEvent('achievement_unlocked', achievementId);
        let unlockedLetters;

        if (list.length >= 10) {
            const state = await query(`SELECT unlocked_letters FROM user_profile WHERE id = 1`);
            const letters = parseJsonArray(state.unlocked_letters);
            if (!letters.includes('letter-5')) {
                letters.push('letter-5');
                await run(`UPDATE user_profile SET unlocked_letters = ? WHERE id = 1`, [JSON.stringify(letters)]);
            }
            unlockedLetters = letters;
        }

        res.json({
            success: true,
            alreadyUnlocked: !updated,
            unlockedAchievements: list,
            unlockedLetters,
        });
    } catch (error) {
        console.error('unlockAchievement error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── POST /progress/easter-eggs/find ──────────────────────────

exports.findEasterEgg = async (req, res) => {
    const { easterEggId } = req.body;

    if (!easterEggId) {
        return res.status(400).json({ success: false, message: 'easterEggId is required' });
    }
    const invalid = validateId(easterEggId, 'easterEggId');
    if (invalid) return res.status(400).json(invalid);
    const unknown = validateKnownId(easterEggId, 'easterEggId', 'easterEggs');
    if (unknown) return res.status(400).json(unknown);

    try {
        const { updated, list } = await addToJsonArrayColumn('found_easter_eggs', easterEggId);
        if (updated) await recordEvent('easter_egg_found', easterEggId);

        res.json({
            success: true,
            alreadyFound: !updated,
            foundEasterEggs: list,
        });
    } catch (error) {
        console.error('findEasterEgg error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── POST /progress/theme ─────────────────────────────────────

exports.setTheme = async (req, res) => {
    const { theme } = req.body;

    if (!theme) {
        return res.status(400).json({ success: false, message: 'theme is required' });
    }

    const allowedThemes = ['theme-default', 'theme-sakura', 'theme-winter', 'theme-halloween', 'theme-summer', 'theme-christmas'];

    if (!allowedThemes.includes(theme)) {
        return res.status(400).json({
            success: false,
            message: `Invalid theme. Allowed: ${allowedThemes.join(', ')}`,
        });
    }

    try {
        await run(`UPDATE user_profile SET active_theme = ? WHERE id = 1`, [theme]);

        res.json({
            success: true,
            activeTheme: theme,
        });
    } catch (error) {
        console.error('setTheme error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── GET /progress/streak ─────────────────────────────────────

exports.getStreak = async (req, res) => {
    try {
        const state = await query(
            `SELECT consecutive_days, longest_streak, last_visit_date, total_hearts FROM user_profile WHERE id = 1`
        );

        if (!state) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        res.json({
            success: true,
            data: {
                currentStreak: state.consecutive_days || 0,
                longestStreak: state.longest_streak || state.consecutive_days || 0,
                consecutiveDays: state.consecutive_days || 0,
                totalHearts: state.total_hearts || 0,
                lastVisit: state.last_visit_date || null,
            },
        });
    } catch (error) {
        console.error('getStreak error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── GET /progress/secret ─────────────────────────────────────

/**
 * Secret zone requirements:
 *  - 5+ achievements unlocked
 *  - 3+ easter eggs found
 *  - 7+ consecutive days streak
 *  - All 3 normal letters unlocked (letter_1, letter_2, letter_3)
 */
exports.checkSecret = async (req, res) => {
    try {
        const state = await query(
            `SELECT unlocked_achievements, found_easter_eggs, consecutive_days,
                    unlocked_letters, secret_zone_unlocked
             FROM user_profile WHERE id = 1`
        );

        if (!state) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        const achievements = parseJsonArray(state.unlocked_achievements);
        const easterEggs   = parseJsonArray(state.found_easter_eggs);
        const letters      = parseJsonArray(state.unlocked_letters);
        const streak       = state.consecutive_days || 0;

        const requiredLetters = ['letter-1', 'letter-2', 'letter-3'];
        const hasAllLetters   = requiredLetters.every((l) => letters.includes(l));

        const conditions = {
            achievements:  { met: achievements.length >= 5,  current: achievements.length, required: 5 },
            easterEggs:    { met: easterEggs.length >= 3,    current: easterEggs.length,   required: 3 },
            consecutiveDays: { met: streak >= 7,             current: streak,               required: 7 },
            allLetters:    { met: hasAllLetters,             current: letters.length,       required: 3 },
        };

        const canUnlock = Object.values(conditions).every((c) => c.met);

        res.json({
            success: true,
            secretZoneUnlocked: !!state.secret_zone_unlocked,
            canUnlock,
            conditions,
        });
    } catch (error) {
        console.error('checkSecret error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── POST /progress/secret/unlock ─────────────────────────────

exports.unlockSecret = async (req, res) => {
    try {
        const state = await query(
            `SELECT unlocked_achievements, found_easter_eggs, consecutive_days,
                    unlocked_letters, secret_zone_unlocked
             FROM user_profile WHERE id = 1`
        );

        if (!state) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        // Already unlocked
        if (state.secret_zone_unlocked) {
            return res.json({
                success: true,
                alreadyUnlocked: true,
                secretZoneUnlocked: true,
            });
        }

        // Validate conditions
        const achievements = parseJsonArray(state.unlocked_achievements);
        const easterEggs   = parseJsonArray(state.found_easter_eggs);
        const letters      = parseJsonArray(state.unlocked_letters);
        const streak       = state.consecutive_days || 0;

        const requiredLetters = ['letter-1', 'letter-2', 'letter-3'];
        const hasAllLetters   = requiredLetters.every((l) => letters.includes(l));

        if (achievements.length < 5 || easterEggs.length < 3 || streak < 7 || !hasAllLetters) {
            return res.status(403).json({
                success: false,
                message: 'Secret zone requirements not met',
            });
        }

        await run(
            `UPDATE user_profile SET secret_zone_unlocked = 1,
                unlocked_letters = ?, unlocked_achievements = ? WHERE id = 1`,
            [JSON.stringify([...new Set([...letters, 'letter-secret'])]),
                JSON.stringify([...new Set([...achievements, 'ach-secret-zone'])])]
        );

        res.json({
            success: true,
            alreadyUnlocked: false,
            secretZoneUnlocked: true,
        });
    } catch (error) {
        console.error('unlockSecret error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
