require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tamagotchiRoutes = require('./routes/tamagotchiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Forzar logs claros en consola
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rutas de la API
app.use('/tamagotchi', tamagotchiRoutes);

// Manejo básico de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta de API no encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor de Chiikawa corriendo en el puerto ${PORT}`);
});
