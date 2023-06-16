// express setup
const express = require('express');
const bodyParser = require('body-parser');
const { log } = require('console');
const app = express();
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

// GET, POST, DELETE routes go here!!




// Functions and Server side logic goes here!






// turn on the engine 
app.listen(PORT, () => {
    console.log('Server running on port:', PORT);
})