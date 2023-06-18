// express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Global variables
const calcHistory = require('./modules/history')
let lastCalculation = '';


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

    let package = {
        history: calcHistory,
        lastCalculation: lastCalculation
    }
    console.log('sending last calc:', lastCalculation);

    res.send(package);
    // reset lastCalc
    lastCalculation = '';
    // console.log('sent last calc, should clear:', lastCalc);
})


// clear
app.delete('/clear-history', (req, res) => {
    console.log('delete request made!');

    // clear array 
    calcHistory.length = 0;

    res.sendStatus(201)
})




// Server side logic goes here!

// calculateNumbers(inputOne, inputTwo)
function calculateNumbers(one, two, operation) {

    console.log('made it to calculateNumbers!');
    console.log('inputOne is:', one);
    console.log('inputTwo is:', two);
    console.log('operation is:', operation);
    
    let operator = operation;


    let packageCalculation = {
        inputOne: 0,
        inputTwo: 0,
        operator: '',
        calcString: '',
        result: 0,
    }

    // grabs inputs and places in array object
    packageCalculation.inputOne = one;
    packageCalculation.inputTwo = two;
    packageCalculation.operator = operation;

    // switch calculation dependent on chosenOperation
    switch (operator) {
        case '+':
            // what to do if +
            lastCalculation = one + two;
            
            break;

        case '-':
            // what to do if -
            lastCalculation = one - two

            break;

        case '*':
            // what to do if *
            lastCalculation = one * two

            console.log('multiplication result is:', lastCalculation);

            break;

        case '/':
            // what to do if /
            lastCalculation = one / two
            console.log('division result is:', lastCalculation);

            break;

        default:
            // should I send a error here?
            // can I require operation selection on submission?
            alert(`unrecognized operator [${operator}] selected`);
            // packageCalculation.calcString = 'No operator selected'
            break;
    }

    // package into object
    packageCalculation.result = lastCalculation;
    packageCalculation.calcString = `${one} + ${two} = ${lastCalculation}`
    

    // unshift object to array
    calcHistory.unshift(packageCalculation);

    // console.log('packageCalculation is:', packageCalculation);
}








// turn on the engine 
app.listen(PORT, () => {
    console.log('Server running on port:', PORT);
})