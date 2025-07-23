import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosclient";
import { useParams } from "react-router";
import { FaThumbsUp, FaReply, FaTrash } from "react-icons/fa";

const CommentSection = () => {
  const { problemId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReply, setShowReply] = useState({});

  const fetchComments = async () => {
    try {
      const res = await axiosClient.get(`/comments/problem/${problemId}`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosClient.get("/user/me");
      setCurrentUserId(res.data._id);
      setCurrentUserRole(res.data.role || "");
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axiosClient.post("/comments", {
        problemId,
        content: newComment.trim(),
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleReply = async (commentId) => {
    const content = replyText[commentId]?.trim();
    if (!content) return;
    try {
      await axiosClient.post(`/comments/reply/${commentId}`, { content });
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setShowReply((prev) => ({ ...prev, [commentId]: false }));
      fetchComments();
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axiosClient.post(`/comments/like/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axiosClient.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const toggleReplyInput = (commentId) => {
    setShowReply((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [problemId]);

  return (
    <div className="w-full px-4 py-6 bg-zinc-900 rounded-xl shadow-md border border-zinc-800">
      <h2 className="text-2xl font-semibold text-white mb-6 border-b border-zinc-700 pb-2">
        Discussion
      </h2>

      {/* New Comment */}
      <div className="mb-8">
        <textarea
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 font-medium transition"
            onClick={handleAddComment}
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comment List */}
      {comments.length === 0 ? (
        <div className="text-zinc-500 italic text-center">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const isLiked = currentUserId && comment.likes.includes(currentUserId);
            const canDelete =
              currentUserId === comment.userId?._id || currentUserRole.toLowerCase() === "admin";

            return (
              <div key={comment._id} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <div className="flex gap-3">
                  <div className="bg-zinc-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white">
                    {comment.userId?.firstName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-indigo-400">
                      {comment.userId?.firstName} {comment.userId?.lastName}
                    </span>
                    <p className="text-zinc-200 mt-1">{comment.content}</p>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => handleLike(comment._id)}
                        className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 transition ${
                          isLiked
                            ? "bg-indigo-600 text-white"
                            : "border border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        <FaThumbsUp />
                        <span>{comment.likes.length}</span>
                        <span>{isLiked ? "Liked" : "Like"}</span>
                      </button>

                      <button
                        onClick={() => toggleReplyInput(comment._id)}
                        className="text-sm px-3 py-1 rounded-full border border-zinc-600 text-zinc-300 hover:bg-zinc-700 flex items-center gap-1 transition"
                      >
                        <FaReply />
                        <span>Reply</span>
                      </button>

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-sm px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-500 flex items-center gap-1 transition"
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 pl-5 border-l-2 border-zinc-700 space-y-2">
                        {comment.replies.map((reply, idx) => (
                          <div key={idx} className="flex gap-2 items-center text-sm text-zinc-300">
                            <div className="w-7 h-7 bg-zinc-700 rounded-full flex items-center justify-center font-bold text-white">
                              {reply.userId?.firstName?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="font-semibold text-indigo-400">{reply.userId?.firstName}</span>
                            <span>{reply.content}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {showReply[comment._id] && (
                      <div className="mt-3 ml-12">
                        <textarea
                          className="w-full bg-zinc-800 text-zinc-200 border border-zinc-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows={2}
                          placeholder="Write a reply..."
                          value={replyText[comment._id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [comment._id]: e.target.value,
                            }))
                          }
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            disabled={!replyText[comment._id]?.trim()}
                            onClick={() => handleReply(comment._id)}
                            className="px-4 py-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 font-medium transition disabled:opacity-50"
                          >
                            Post Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
