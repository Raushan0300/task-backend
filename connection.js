const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager';

mongoose.connect(URI)
    .then(()=>{console.log('Connected to MongoDB')})
    .catch(err=>console.log('Error in connecting',err));