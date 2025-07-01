const { error } = require('console');
const mongoose = require('mongoose');
const { run } = require('node:test');
const  Schema  = mongoose.Schema;
const submissionSchema = new Schema({
    problemId: {
        type:Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language:{
        type: String,
        required: true,
        enum: [ 'javascript', 'java', 'cpp' ]},
    status: {
        type: String,
        enum: ['pending', 'accepted','wrong','error'],
        default: 'pending'
    },
    runTime: {
        type: Number,
        default: 0
    },
    memory:{
        type: Number,
        default: 0
    },
    errorMessage:{
        type: String,
        default: ''
    },
    testcasespassed: {
        type: Number,
        default: 0
    },
    totalTestcases: {
        type: Number,
        default: 0
    }},{
    timestamps: true
    });
    submissionSchema.index({userId: 1, problemId: 1});
const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;    
