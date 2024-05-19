const express = require('express');
const cors = require('cors');

const app = express(); // create express app
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(cors()); // for enabling cors

const PORT = process.env.PORT || 8000;

app.get('/', (req, res)=>{
    res.send('Hello World');
})

// import connection.js
require('./connection');

// import Routes
const loginRoute = require('./routes/LoginRoute');
const signupRoute = require('./routes/SignupRoute');
const boardRoute = require('./routes/BoardsRoutes');
const taskRoute = require('./routes/TaskRoute');

// use Routes
app.use('/', loginRoute);
app.use('/', signupRoute);
app.use('/', boardRoute);
app.use('/', taskRoute);



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});