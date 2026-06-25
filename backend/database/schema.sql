CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT DEFAULT 'User',
    visits INTEGER DEFAULT 0,
    last_connection TEXT,
    -- Estado del Tamagotchi
    happiness INTEGER DEFAULT 50,
    hunger INTEGER DEFAULT 50,
    sleep INTEGER DEFAULT 50,
    -- Progreso guardado como JSON Strings
    unlocked_letters TEXT DEFAULT '[]',
    viewed_songs TEXT DEFAULT '[]',
    unlocked_achievements TEXT DEFAULT '[]',
    found_easter_eggs TEXT DEFAULT '[]',
    secret_zone_unlocked INTEGER DEFAULT 0
);

-- Inicializar la fila del usuario único si no existe
INSERT INTO user_profile (id, username, last_connection) 
SELECT 1, 'Chiikawa Lover', datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM user_profile WHERE id = 1);
