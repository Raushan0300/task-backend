const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../models/Users');

router.post('/signup', async (req, res)=>{
    const {email, password} = req.body; // get email and password from request body
    try {
        const user = await User.findOne({email: email}); // find user by email
        if(user){
            res.status(400).json({error: true, msg: 'User already exists'}); // if user already exists
        } else{
            const newUser = new User({
                email: email,
                password: await bcrypt.hash(password, 10) // hash password
            });
            await newUser.save(); // save user
            res.status(200).json({error: false, msg: 'User created successfully'});
        }
    } catch (error) {
        // if any error occurs
        res.status(500).json({error: true, msg: 'Internal Server Error'});
    };
});

module.exports = router;