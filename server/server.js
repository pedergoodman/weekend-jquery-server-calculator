// express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Global variables
const calcHistory = require('./modules/history')



// GET, POST, DELETE routes go here!!
// POST route for input data
app.post('/send-calc', (req, res) => {
    // console.log(req.body.calcInputData);
    // console.log(req.body.calcInputData.inputOne);
    // console.log(req.body.calcInputData.inputTwo);
    // console.log(req.body.calcInputData.chosenOperation);
    let inputOne = Number(req.body.calcInputData.inputOne)
    let inputTwo = Number(req.body.calcInputData.inputTwo)
    let chosenOperation = req.body.calcInputData.chosenOperation

    // send to calculation
    calculateNumbers(inputOne, inputTwo, chosenOperation)

    res.sendStatus(201)
})

app.get('/calc-history', (req, res) => {
    console.log('GetHistory request made.');

    res.send(calcHistory);
})


// Server side logic goes here!

// calculateNumbers(inputOne, inputTwo)
function calculateNumbers(one, two, operation) {

    console.log('made it to calculateNumbers!');
    // console.log('inputOne is:', one);
    // console.log('inputTwo is:', two);
    // console.log('operation is:', operation);
    let operator = operation;
    let result;
    

    let packageCalculation = {
        inputOne: 0,
        inputTwo: 0,
        operator: '',
        calcString: '',
        result: 0,
    }
    packageCalculation.inputOne = one;
    packageCalculation.inputTwo = two;
    packageCalculation.operator = operation;

    // switch calculation dependent on chosenOperation
    switch (operator) {
        case '+':
            // what to do if +
            // add numbers
            result = one + two
            // package into object
            packageCalculation.result = result;
            packageCalculation.calcString = `${one} + ${two} = ${result}`
            break;

        case '-':
            // what to do if -
            result = one - two
            // package into object
            packageCalculation.result = result;
            packageCalculation.calcString = `${one} - ${two} = ${result}`
            break;

        case '*':
            // what to do if *
            result = one * two
            // package into object
            packageCalculation.result = result;
            packageCalculation.calcString = `${one} * ${two} = ${result}`
            break;

        case '/':
            // what to do if /
            result = one * two
            // package into object
            packageCalculation.result = result;
            packageCalculation.calcString = `${one} / ${two} = ${result}`
            break;

        default:
            // should I send a error here?
            // can I require operation selection on submission?
            console.log('no operator selected');
            packageCalculation.calcString = 'No operator selected'
            break;
    }

    // unshift object to array
    calcHistory.unshift(packageCalculation);

    calcHistory
    // console.log('packageCalculation is:', packageCalculation);
}








// turn on the engine 
app.listen(PORT, () => {
    console.log('Server running on port:', PORT);
})