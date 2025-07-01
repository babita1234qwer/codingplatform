const ContestSubmission = require('../models/contestsubmission');
const User = require('../models/user');
const mongoose = require('mongoose');

const getLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;

    const leaderboard = await ContestSubmission.aggregate([
      {
        $match: {
          contestId: new mongoose.Types.ObjectId(contestId),
        },
      },
      {
        // Pick the best score per user per problem
        $group: {
          _id: { userId: "$userId", problemId: "$problemId" },
          bestScore: { $max: "$score" },
        },
      },
      {
        // Group again by userId to sum total score
        $group: {
          _id: "$_id.userId",
          totalScore: { $sum: "$bestScore" },
        },
      },
      {
        // Join user info
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
       $project: {
    _id: 0,
    userId: "$user._id",
    name: {
      $concat: [
        { $ifNull: ["$user.firstName", ""] },
        " ",
        { $ifNull: ["$user.lastName", ""] }
      ]
    },
    totalScore: 1,
  },
      },
      {
        $sort: { totalScore: -1 }, // descending score
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
module.exports = {
  getLeaderboard,
};