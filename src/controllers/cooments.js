const Comment = require("../models/comment");
const Problem = require("../models/problem");

// Add a comment
const addComment = async (req, res) => {
    try {
        const { content, problemId } = req.body;
        const userId = req.result._id;

        const problemExists = await Problem.findById(problemId);
        if (!problemExists) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const newComment = new Comment({
            content,
            problemId,
            userId
        });

        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error("Add Comment Error:", error);
        res.status(500).json({ error: "Server error while adding comment" });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.result._id;
        const userRole = req.result.role;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.userId.toString() !== userId.toString() && userRole !== "admin") {
            return res.status(403).json({ error: "Unauthorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Delete Comment Error:", error);
        res.status(500).json({ error: "Server error while deleting comment" });
    }
};

// Get all comments for a specific problem
const getComments = async (req, res) => {
    try {
        const { problemId } = req.params;

        const comments = await Comment.find({ problemId })
            .populate('userId', 'firstName lastName emailid')
            .populate('replies.userId', 'firstName lastName emailid')
            .sort({ createdAt: -1 });

        res.status(200).json({ comments });
    } catch (error) {
        console.error("Get Comments Error:", error);
        res.status(500).json({ error: "Server error while fetching comments" });
    }
};
const toggleLike = async (req, res) => {
  try {
    const userId = req.result._id;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const index = comment.likes.indexOf(userId);
    if (index > -1) {
      comment.likes.splice(index, 1); // Unlike
    } else {
      comment.likes.push(userId); // Like
    }

    await comment.save();
    res.status(200).json({ message: "Toggled like", likes: comment.likes.length });
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }}
  // Reply to a comment
const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.result._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.replies.push({ userId, content });
    await comment.save();

    res.status(201).json({ message: "Reply added successfully", replies: comment.replies });
  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ error: "Server error while replying to comment" });
  }
};

module.exports = {
    addComment,
    deleteComment,
    getComments,toggleLike,replyToComment
};
