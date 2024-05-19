const express = require('express');
const router = express.Router();

const Task = require('../models/Tasks');  // import Task model
const User = require('../models/Users');  // import User model

const Board = require('../models/Boards'); // Assuming you have a Board model

router.get('/alltasks', async(req, res)=>{
    const {token, boardid} = req.headers; // get token from headers
    try {
        const user = await User.findOne({token}); // find user by token
        if(user){
            // First, find the board to ensure it belongs to the user
            const board = await Board.findOne({_id: boardid, createdBy: user._id});
            if (board) {
                // If the board belongs to the user, find tasks associated with this board
                const tasks = await Task.find({boardId: board._id}); // find tasks for the board

                const todoTask = tasks.map(task => task.todo ? {todo: task.todo}:undefined).filter(task=>task!==undefined);
                const doingTask = tasks.map(task => task.doing ? {doing: task.doing}:undefined).filter(task=>task!==undefined);
                const doneTask = tasks.map(task => task.done ? {done: task.done}:undefined).filter(task=>task!==undefined);

                res.status(200).json({error: false, tasks:{todo: todoTask, doing: doingTask, done: doneTask}});
            } else {
                // If the board does not belong to the user, respond with an error
                res.status(403).json({error: true, msg: 'Access to the board is denied'});
            };
        } else{
            res.status(401).json({error: true, msg: 'Unauthorized'});
        }
    } catch (error) {
        res.status(500).json({error: true, msg: 'Internal Server Error'});
    }
});

router.post('/addtask', async(req, res)=>{
    const {token, todo, doing, done, boardId} = req.body; // get token, todo, doing, done and boardId from request body
    try {
        const user = await User.findOne({token}); // find user by token
        if(user){
            const task = new Task({
                todo,
                doing,
                done,
                boardId
            });
            await task.save(); // save task
            res.status(200).json({error: false, msg: 'Task Created Successfully'});
        } else{
            res.status(401).json({error: true, msg: 'Unauthorized'});
        };
    } catch (error) {
        res.status(500).json({error: true, msg: 'Internal Server Error'});
    }
});

module.exports = router;