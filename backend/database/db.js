const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// La ruta apunta a la carpeta montada por el volumen de Docker
const dbPath = path.join(__dirname, 'sqlite.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos SQLite:', err.message);
    } else {
        console.log('Conectado exitosamente a la base de datos SQLite.');
        initDatabase();
    }
});

function initDatabase() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error al inicializar las tablas:', err.message);
        } else {
            console.log('Tablas de la base de datos verificadas/inicializadas.');
        }
    });
}

module.exports = db;
