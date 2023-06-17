// express setup
const express = require('express');
const bodyParser = require('body-parser');
const { log } = require('console');
const app = express();
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

// GET, POST, DELETE routes go here!!

// TODO post



// Functions and Server side logic goes here!



calculateNumbers(inputOne, inputTwo)
function calculateNumbers(one, two) {
    switch (operationButton) {
     case '+':
         // what to do if +
         break;
     case '-':
        // what to do if -
         break;
     case '*':
         // what to do if *
         break;
     case '/':
        // what to do if /
         break;
     default:
        // should I send a error here?
         break;
    }
     
 }

// how do I package the data?






// turn on the engine 
app.listen(PORT, () => {
    console.log('Server running on port:', PORT);
})