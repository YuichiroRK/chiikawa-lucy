const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Letters
router.post('/letters/unlock', progressController.unlockLetter);

// Songs
router.post('/songs/view', progressController.viewSong);

// Achievements
router.post('/achievements/unlock', progressController.unlockAchievement);

// Easter Eggs
router.post('/easter-eggs/find', progressController.findEasterEgg);

// Theme
router.post('/theme', progressController.setTheme);

// Streak
router.get('/streak', progressController.getStreak);

// Secret Zone
router.get('/secret', progressController.checkSecret);
router.post('/secret/unlock', progressController.unlockSecret);

module.exports = router;
