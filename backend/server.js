require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tamagotchiRoutes = require('./routes/tamagotchiRoutes');
const progressRoutes = require('./routes/progressRoutes');
const { query } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || false }));
app.use(express.json({ limit: '100kb' }));

const requestCounts = new Map();
app.use((req, res, next) => {
    const now = Date.now();
    const entry = requestCounts.get(req.ip);
    if (!entry || now - entry.startedAt >= 60000) {
        requestCounts.set(req.ip, { startedAt: now, count: 1 });
        return next();
    }
    entry.count += 1;
    if (entry.count > 120) return res.status(429).json({ success: false, message: 'Too many requests' });
    next();
});

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/ready', async (req, res) => {
    try {
        await query('SELECT 1');
        res.json({ success: true, status: 'ready' });
    } catch (error) {
        res.status(503).json({ success: false, status: 'not-ready', error: error.message });
    }
});

// API Routes
app.use('/tamagotchi', tamagotchiRoutes);
app.use('/progress', progressRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

// Global error handler
app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Chiikawa server running on port ${PORT}`);
});
