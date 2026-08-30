-- ============================================================
-- Chiikawa Tamagotchi - Database Schema
-- Single-user app (id=1, user "Lucy")
-- ============================================================

CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT DEFAULT 'User',
    visits INTEGER DEFAULT 0,
    last_connection TEXT,
    -- Tamagotchi stats
    happiness INTEGER DEFAULT 50,
    hunger INTEGER DEFAULT 50,
    sleep INTEGER DEFAULT 50,
    -- Progress stored as JSON strings
    unlocked_letters TEXT DEFAULT '[]',
    viewed_songs TEXT DEFAULT '[]',
    unlocked_achievements TEXT DEFAULT '[]',
    found_easter_eggs TEXT DEFAULT '[]',
    secret_zone_unlocked INTEGER DEFAULT 0,
    -- Streak and engagement tracking
    consecutive_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_visit_date TEXT,
    total_hearts INTEGER DEFAULT 0,
    active_theme TEXT DEFAULT 'default',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Initialize the single user row if it doesn't exist
INSERT INTO user_profile (id, username, last_connection, last_visit_date)
SELECT 1, 'Lucy', datetime('now'), date('now')
WHERE NOT EXISTS (SELECT 1 FROM user_profile WHERE id = 1);

CREATE TABLE IF NOT EXISTS progress_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    item_id TEXT,
    metadata TEXT DEFAULT '{}',
    created_at TEXT DEFAULT (datetime('now'))
);
