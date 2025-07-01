const express = require('express');
const leaderrouter = express.Router();
const { getLeaderboard } = require('../controllers/leaderboard');

// GET /api/contest/:contestId/leaderboard
leaderrouter.get('/contest/:contestId/leaderboard', getLeaderboard);

module.exports = leaderrouter;