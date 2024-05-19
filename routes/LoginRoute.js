const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/Users');

router.post('/login', async (req, res)=>{
    const {email, password} = req.body; // get email and password from request body
    try {
        const user = await User.findOne({email: email}); // find user by email
        if(user){
            const validateUser = await bcrypt.compare(password, user.password); // compare password
            if(validateUser){
                // create token
                const token = jwt.sign({
                    email: user.email,
                    _id: user._id
                }, process.env.JWT_SECRET_KEY || 'mysecret');
                
                // update token in database
                await User.updateOne({_id: user._id}, {token: token});
                user.save();
                res.status(200).json({error: false, msg: 'Login Successful', token: token});
            } else{
                // if password is incorrect
                res.status(401).json({error: true, msg: 'Invalid Credentials'});
            }
        } else{
            // if user does not exist
            res.status(400).json({error: true, msg: 'Invalid Credentials'});
        }
    } catch (error) {
        // if any error occurs
        res.status(500).json({error: true, msg: 'Internal Server Error'});
    };
});

module.exports = router;