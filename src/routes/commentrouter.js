const express = require('express');
const Commentrouter = express.Router();
const { addComment, deleteComment,toggleLike,getComments ,replyToComment} = require('../controllers/cooments');
const userMiddleware = require('../middleware/usermiddleware');

// POST /comments
Commentrouter.post('/', userMiddleware, addComment);
Commentrouter.get('/problem/:problemId', userMiddleware, getComments);
Commentrouter.post('/reply/:commentId',userMiddleware,replyToComment);

// DELETE /comments/:commentId
Commentrouter.delete('/:commentId', userMiddleware, deleteComment);
Commentrouter.post("/like/:commentId", userMiddleware, toggleLike);

module.exports = Commentrouter;
