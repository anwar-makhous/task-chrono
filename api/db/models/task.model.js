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
    startTime: {
        type: Date, // Use Date type for timestamps
    },
    stopTime: {
        type: Date,
    },
    totalMinutes: {
        type: Number, // Assuming this will store the duration in minutes
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task }