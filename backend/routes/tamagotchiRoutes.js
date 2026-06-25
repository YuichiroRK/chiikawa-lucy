const express = require('express');
const router = express.Router();
const tamagotchiController = require('../controllers/tamagotchiController');

// Rutas base del Tamagotchi
router.get('/status', tamagotchiController.getStatus);
router.post('/action', tamagotchiController.performAction);

module.exports = router;
