const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;

// Import the connectDB function from database/index
const connectDB = require('./databaseb');
// Connect to MongoDB
connectDB();

//app config
app.use(cors()); //Allows requests from any origin
app.use(express.json()); //Parses incoming JSON data

//app routers
app.use('/', require('./routes')); //Main router

//app listen
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
