const express = require('express');
const router = express.Router();

const Board = require('../models/Boards');  // import Board model
const User = require('../models/Users');  // import User model

router.get('/allboards', async(req, res)=>{
    const {token} = req.headers; // get token from headers
    try {
        const user = await User.findOne({token}); // find user by token
        if(user){
            const boards = await Board.find({createdBy: user._id}); // find boards created by user
            const boardDetails = boards.map(board => {return {id:board._id, name: board.name, description: board.description}});
            res.status(200).json({error: false, boards: boardDetails});
        } else{
            res.status(401).json({error: true, msg: 'Unauthorized'});
        };
    } catch (error) {
        res.status(500).json({error: true, msg: 'Internal Server Error'});
    };
});

router.post('/addboard', async(req, res)=>{
    const {token, name, description} = req.body; // get token, name and description from request body
    try {
        const user = await User.findOne({token}); // find user by token
        if(user){
            const board = new Board({
                name,
                description,
                createdBy: user._id
            });
            await board.save(); // save board
            res.status(200).json({error: false, msg: 'Board Created Successfully'});
        } else{
            res.status(401).json({error: true, msg: 'Unauthorized'});
        };
    } catch (error) {
        res.status(500).json({error: true, msg: 'Internal Server Error'});
    }
})

module.exports = router;