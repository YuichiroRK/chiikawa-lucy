const db = require('../database/db');

// Auxiliar para ejecutar queries con Promesas de forma limpia
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

// Obtener estado actual completo
exports.getStatus = async (req, res) => {
    try {
        // Actualizar contador de visitas al cargar la app
        await run(`UPDATE user_profile SET visits = visits + 1, last_connection = datetime('now') WHERE id = 1`);
        
        const state = await query(`SELECT * FROM user_profile WHERE id = 1`);
        
        // Parsear los campos JSON para enviarlos como arreglos al frontend
        state.unlocked_letters = JSON.parse(state.unlocked_letters);
        state.viewed_songs = JSON.parse(state.viewed_songs);
        state.unlocked_achievements = JSON.parse(state.unlocked_achievements);
        state.found_easter_eggs = JSON.parse(state.found_easter_eggs);

        res.json({ success: true, data: state });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Ejecutar una acción sobre el Tamagotchi (feed, play, sleep, pet)
exports.performAction = async (req, res) => {
    const { action } = req.body; // 'feed', 'play', 'sleep', 'pet'
    try {
        const state = await query(`SELECT happiness, hunger, sleep, unlocked_achievements FROM user_profile WHERE id = 1`);
        let { happiness, hunger, sleep, unlocked_achievements } = state;
        unlocked_achievements = JSON.parse(unlocked_achievements);

        let animationTrigger = 'idle';
        let dialogue = '¡Haaai! ✨';

        switch (action) {
            case 'feed':
                hunger = Math.min(100, hunger + 20);
                happiness = Math.min(100, happiness + 5);
                animationTrigger = 'happy';
                dialogue = '¡Mogu mogu! 🍓';
                if (!unlocked_achievements.includes('Alimentaste a Chiikawa')) {
                    unlocked_achievements.push('Alimentaste a Chiikawa');
                }
                break;
            case 'play':
                happiness = Math.min(100, happiness + 25);
                hunger = Math.max(0, hunger - 15);
                sleep = Math.max(0, sleep - 10);
                animationTrigger = 'love';
                dialogue = '¡Yaah! 🎒🌟';
                break;
            case 'sleep':
                sleep = Math.min(100, sleep + 40);
                hunger = Math.max(0, hunger - 10);
                animationTrigger = 'sleep';
                dialogue = 'Fuu... Zzz 💤';
                break;
            case 'pet':
                happiness = Math.min(100, happiness + 15);
                animationTrigger = 'love';
                dialogue = '¡Uraaa! 🥰🌸';
                break;
            default:
                return res.status(400).json({ success: false, message: 'Acción no válida' });
        }

        // Guardar cambios
        await run(
            `UPDATE user_profile SET 
                happiness = ?, hunger = ?, sleep = ?, unlocked_achievements = ? 
             WHERE id = 1`,
            [happiness, hunger, sleep, JSON.stringify(unlocked_achievements)]
        );

        res.json({
            success: true,
            message: `Acción ${action} completada`,
            stats: { happiness, hunger, sleep },
            animation: animationTrigger,
            dialogue,
            achievements: unlocked_achievements
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
