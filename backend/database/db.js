const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path (mounted volume in Docker)
const dbPath = path.join(__dirname, 'sqlite.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.configure('busyTimeout', 5000);
        db.run('PRAGMA journal_mode = WAL');
        db.run('PRAGMA synchronous = NORMAL');
        initDatabase();
    }
});

// ── Promise-based helpers ────────────────────────────────────

/** Run a SELECT that returns a single row */
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

/** Run an INSERT / UPDATE / DELETE */
const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this); // `this` contains lastID, changes
        });
    });
};

/** Run a SELECT that returns multiple rows */
const runAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// ── Schema initialisation + migrations ───────────────────────

function initDatabase() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initialising tables:', err.message);
        } else {
            console.log('Database tables verified / initialised.');
        }
        // Run migrations regardless – they are safe to re-run
        runMigrations();
    });
}

/**
 * Add columns that may not exist yet.
 * Each ALTER TABLE is wrapped so "duplicate column" errors are silently ignored.
 */
function runMigrations() {
    const newColumns = [
        { name: 'consecutive_days', definition: 'INTEGER DEFAULT 0' },
        { name: 'longest_streak',   definition: 'INTEGER DEFAULT 0' },
        { name: 'last_visit_date',  definition: 'TEXT' },
        { name: 'total_hearts',     definition: 'INTEGER DEFAULT 0' },
        { name: 'active_theme',     definition: "TEXT DEFAULT 'default'" },
        // SQLite does not allow adding a column with a non-constant default.
        { name: 'created_at',       definition: 'TEXT' },
    ];

    newColumns.forEach(({ name, definition }) => {
        const sql = `ALTER TABLE user_profile ADD COLUMN ${name} ${definition}`;
        db.run(sql, (err) => {
            if (err) {
                // "duplicate column name" is expected if migration already ran
                if (!err.message.includes('duplicate column name')) {
                    console.error(`Migration error (${name}):`, err.message);
                }
            } else {
                console.log(`Migration: added column "${name}".`);
                if (name === 'created_at') {
                    db.run(`UPDATE user_profile SET created_at = datetime('now') WHERE created_at IS NULL`);
                }
            }
        });
    });
}

function recordEvent(eventType, itemId = null, metadata = {}) {
    return run(
        `INSERT INTO progress_events (event_type, item_id, metadata) VALUES (?, ?, ?)`,
        [eventType, itemId, JSON.stringify(metadata)]
    );
}

module.exports = { db, query, run, runAll, recordEvent };
