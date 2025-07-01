const mongoose = require("mongoose");

const contestSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contestId: { type: mongoose.Schema.Types.ObjectId, ref: "Contest", required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  score: { type: Number, default: 0 }, 
  submissionTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ContestSubmission", contestSubmissionSchema);