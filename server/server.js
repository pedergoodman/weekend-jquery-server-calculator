// express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// server-side global variables
const calcHistory = require('./modules/history')
let lastCalculation = '';


// ROUTES

// POST route to capture input calculation data
app.post('/send-calc', (req, res) => {
    // console.log(req.body.calcInputData);

    // separate out data
    let inputOne = Number(req.body.calcInputData.inputOne)
    let inputTwo = Number(req.body.calcInputData.inputTwo)
    let chosenOperation = req.body.calcInputData.chosenOperation

    // send to calculation
    calculateNumbers(inputOne, inputTwo, chosenOperation)

    res.sendStatus(201)
})

// GET route to send calcHistory and lastCalculation to client
app.get('/calc-history', (req, res) => {
    //  console.log('GetHistory request made.');

    // packaged data for client
    let package = {
        history: calcHistory,
        lastCalculation: lastCalculation
    }
    console.log('sending last calc:', lastCalculation);

    // send data to client 
    res.send(package);

    // reset lastCalculation to empty
    lastCalculation = '';
})

// DELETE route to clear calcHistory
app.delete('/clear-history', (req, res) => {
    // console.log('delete request made!');

    // clear array 
    calcHistory.length = 0;

    res.sendStatus(201)
})



// SERVER LOGIC

// calculateNumbers(inputOne, inputTwo)
function calculateNumbers(one, two, operation) {
    // console.log('made it to calculateNumbers!');
    // console.log('inputOne is:', one);
    // console.log('inputTwo is:', two);
    // console.log('operation is:', operation);

    // for building object to add to calcHistory
    let packageCalculation = {
        inputOne: 0,
        inputTwo: 0,
        operator: '',
        calcString: '',
        result: 0,
    }

    // put initial inputs in array object
    packageCalculation.inputOne = one;
    packageCalculation.inputTwo = two;
    packageCalculation.operator = operation;

    // switch calculation dependent on chosenOperation
    switch (operation) {
        case '+':
            lastCalculation = one + two;
            break;
        case '-':
            lastCalculation = one - two
            break;
        case '*':
            lastCalculation = one * two
            break;
        case '/':
            lastCalculation = one / two
            break;
        default:
            // just in case, no operator error
            alert(`unrecognized operator [${operator}] selected`);
            break;
    }

    // package into object
    packageCalculation.result = lastCalculation;
    packageCalculation.calcString = `${one} + ${two} = ${lastCalculation}`
    

    // unshift object to array
    calcHistory.unshift(packageCalculation);

    // console.log('packageCalculation is:', packageCalculation);
}




// turn on the server 
app.listen(PORT, () => {
    console.log('Server running on port:', PORT);
})