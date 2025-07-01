const mongoose = require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxLength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxLength: 1000
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    replies: [replySchema], // one-level nested replies
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
