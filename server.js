const express = require('express');
const app = express();
const cors = require('cors');
const { initDb } = require('./database');
require('dotenv').config();
const port = process.env.PORT;

//app config
app.use(cors()); //Allows requests from any origin
app.use(express.json()); //Parses incoming JSON data

//app routers
app.use('/', require('./routes')); //Main router

//app listen
// app.listen(port, () => {

//     console.log(`Server started on port ${port}`);
// });

//Run server and connect database
const launchServer = async () => {
    try {
        await initDb();
        app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    } catch (err) {
        console.error("Server failed to start:", err);
    }
};

launchServer();