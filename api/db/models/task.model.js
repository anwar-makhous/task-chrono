const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _projectId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    running: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        default: new Date()
    },
    lastRunDate: {
        type: Date,
        default: new Date()
    },
    totalSeconds: {
        type: Number,
        default: 0
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task }