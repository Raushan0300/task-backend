const mongoose = require('mongoose');
const Board = require('./Boards');

const taskSchema = new mongoose.Schema({
    todo: {
        type: String
    },
    doing:{
        type: String
    },
    done:{
        type: String
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;