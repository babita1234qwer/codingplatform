const express = require('express');
const leaderrouter = express.Router();
const { getLeaderboard } = require('../controllers/leaderboard');


leaderrouter.get('/contest/:contestId/leaderboard', getLeaderboard);

module.exports = leaderrouter;
