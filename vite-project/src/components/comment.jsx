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
      await axiosClient.post(`/comments/reply/${commentId}`, {
        content,
      });
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
    <div className="p-6 max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg border border-base-200">
      <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">Discussion</h2>

      {/* Add new comment */}
      <div className="mb-8">
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddComment}
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <div className="text-base-content/60 italic text-center">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const isLiked = currentUserId && comment.likes.includes(currentUserId);
            const canDelete =
              currentUserId === comment.userId?._id ||
              currentUserRole.toLowerCase() === "admin";
            return (
              <div
                key={comment._id}
                className="card bg-base-200 shadow border border-base-300"
              >
                <div className="card-body p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                          <span>
                            {comment.userId?.firstName?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-base-content">
                          {comment.userId?.firstName} {comment.userId?.lastName}
                        </span>
                        <p className="text-base-content/80 mt-1">{comment.content}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            className={`btn btn-xs flex items-center gap-1 ${
                              isLiked ? "btn-info text-white" : "btn-ghost"
                            }`}
                            title={isLiked ? "Unlike" : "Like"}
                            onClick={() => handleLike(comment._id)}
                          >
                            <FaThumbsUp />
                            <span>{comment.likes.length}</span>
                            <span>{isLiked ? "Liked" : "Like"}</span>
                          </button>
                          <button
                            className="btn btn-xs btn-ghost flex items-center gap-1"
                            title="Reply"
                            onClick={() => toggleReplyInput(comment._id)}
                          >
                            <FaReply />
                            <span>Reply</span>
                          </button>
                          {canDelete && (
                            <button
                              className="btn btn-xs btn-error btn-outline flex items-center gap-1"
                              title="Delete"
                              onClick={() => handleDelete(comment._id)}
                            >
                              <FaTrash />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Replies with avatar */}
                  {comment.replies.length > 0 && (
                    <div className="mt-3 ml-8 border-l-2 border-base-300 pl-4 space-y-2">
                      {comment.replies.map((reply, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-base-content/80">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-6 h-6">
                              <span>
                                {reply.userId?.firstName?.[0]?.toUpperCase() || "U"}
                              </span>
                            </div>
                          </div>
                          <span className="font-semibold">{reply.userId?.firstName || "User"}</span>
                          <span>{reply.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input (toggle) */}
                  {showReply[comment._id] && (
                    <div className="ml-8 mt-3">
                      <textarea
                        className="textarea textarea-sm textarea-bordered w-full"
                        placeholder="Write a reply..."
                        value={replyText[comment._id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [comment._id]: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                      <div className="flex justify-end mt-1">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleReply(comment._id)}
                          disabled={!replyText[comment._id]?.trim()}
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}
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
