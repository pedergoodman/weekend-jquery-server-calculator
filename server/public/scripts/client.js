$(document).ready(onReady);

// global variables for 
let chosenOperation = '';
let inputOne = '';
let inputTwo = '';
let inputConcat = '';
let submitted = false;

function onReady() {
    console.log('jQuery loaded');

    // loads history onto page 
    getHistory()

    // Button listeners!
    $('.clear-inputs').on('click', clearInputs)
    $('.clear-all').on('click', deleteHistory)

    $('.number-btn').on('click', addToInput)
    $('#submit-button').on('click', postCalculation)
    $('.operation-btn').on('click', selectOperationButton)

    // access history data values
    $('#display-history').on('click', '.history-list', grabHistoryValues)
}

// AC & C clears DOM & input fields
function clearInputs() {
    // deselects and clears value of chosenOperation
    $('.operation-btn').removeClass('active');
    // clears input variables
    chosenOperation = '';
    inputOne = '';
    inputTwo = '';
    inputConcat = '';
    submitted = false;
    // clears number input value
    $('.number-input').val('')
    // clears calculated total
    $('#total').text('')
}

// Adds numbers to inputs
function addToInput() {
    // console.log('button value is:', $(this).val());

    // If a submission has been made previously, clear the inputs first
    if (submitted) {
        clearInputs()
        submitted = false;
    }

    // if operator is true put in in2, otherwise put in in1
    if (chosenOperation) {
        // add to input2 if an operator has been selected
        inputTwo += $(this).val();
        inputConcat = inputOne + chosenOperation + inputTwo;
    } else {
        // else add to input1
        inputOne += $(this).val();
        inputConcat = inputOne + chosenOperation;
    }

    // console.log('building string');
    // console.log('inputOne is:', inputOne);
    // console.log('inputTwo is:', inputTwo);
    // console.log('chosenOperation is:', chosenOperation);
    console.log('inputConcat:', inputConcat);


    // console.log($('.number-input').val(''));
    // TODO why wont this append right!
    $('.number-input').val(inputConcat);

}

// checking values of list items
function grabHistoryValues() {
    // Check values access
    // console.log('list item clicked!');
    // console.log($(this).data('saveOperation'));
    // console.log('saved n1:', $(this).data('saveOperation').inputOne);
    // console.log('saved n2:', $(this).data('saveOperation').inputTwo);
    // console.log('saved op:', $(this).data('saveOperation').operator);
    // clear results 

    // set operation values
    inputOne = $(this).data('saveOperation').inputOne
    inputTwo = $(this).data('saveOperation').inputTwo
    chosenOperation = $(this).data('saveOperation').operator

    postCalculation(event)

    inputConcat = inputOne + chosenOperation + inputTwo;
    $('.number-input').val(inputConcat);


}

// toggles selected operation, both value to be passed & highligh on DOM
function selectOperationButton() {
    $('.operation-btn').removeClass('not-selected')
    chosenOperation = $(this).val()
    // console.log('operation is:', chosenOperation);

    // keeps selected operation highlighted
    $('.operation-btn').removeClass('active')
    $(this).addClass('active')

    inputConcat = inputOne + chosenOperation + inputTwo;
    $('.number-input').val(inputConcat);
}

// GET & POST routes

// check if input is ready to post to server
function checkReadyToCalculate() {
    if (chosenOperation === '') {
        // flash operation buttons if chosenOperation is empty
        $('.operation-btn').addClass('not-selected')
        setTimeout(() => {
            $('.operation-btn').removeClass('not-selected')
        }, "100")

        return false;

    } else if (inputTwo === '') {
        // flash input buttons if input2 is empty
        $('.number-btn').addClass('not-selected')
        setTimeout(() => {
            $('.number-btn').removeClass('not-selected')
        }, "100")

        // console.log('Please select second operand');
        return false;
    } else {
        // let postCalculation run
        return true;
    }

}

// sends submitted calculation and operator to server.
function postCalculation() {

    // check if inputs are ready
    if (checkReadyToCalculate()) {
        // console.log('posting to server');
        // console.log('inputOne is:', inputOne);
        // console.log('inputTwo is:', inputTwo);
        // console.log('chosenOperation is:', chosenOperation);

        // package 2 numbers & chosen math operation
        $.ajax({
            method: 'POST',
            url: '/send-calc',
            data: {
                calcInputData: {
                    inputOne: inputOne,
                    inputTwo: inputTwo,
                    chosenOperation: chosenOperation
                }
            }
        }).then((response) => {
            console.log('Post Successful');

            // loads history onto page 
            getHistory()
            // saves submission status, so we can recalculate last calculation
            submitted = true;

        }).catch((alert) => {
            alert("Data wasn't sent to Server.");
            console.log("post calc #s failed.");
        })
    }



}

// get getHistory array from server
function getHistory() {
    $.ajax({
        method: 'GET',
        url: '/calc-history'
    }).then((response) => {
        // console.log('response is:', response);

        // send to render history
        renderHistory(response)
    }).catch((error) => {
        alert('History was not found');
        console.log('getHistory error is:', error);
    })
}

// builds string do display result
function buildResultString(response) {
    return `${response.inputOne} ${response.operator} ${response.inputTwo} = ${stringifyNumber(response.result)}`
}

// rounds decimals to nearest thousandth & cuts off trailing 0's
function stringifyNumber(num) {
    // console.log('stringifyNumber is:', num);
    return Number(num).toFixed(3).replace(/\.?0+$/, '');
}

// renders calcHistory to DOM, stores calculation data in element
function renderHistory(response) {
    // console.log('in renderHistory!');
    // console.log('history is:', response.history);
    // console.log('lastCalculation is:', response.lastCalculation);
    // console.log('response.length is:', response.history.length);
    
    // displays latest calc on DOM, & runs only if there is history
    if (response.history.length > 0 && response.lastCalculation) {
        $('#total').text(stringifyNumber(response.lastCalculation));
    };

    // empty's history display before rendering to DOM
    $('#display-history ul').empty();

    // renders calcHistory to DOM
    for (const historyObject of response.history) {
        // console.log(historyObject.calcString);
        $('#display-history ul').append(`
            <li class="history-list">${buildResultString(historyObject)}</li>
        `);
        // stores operation details in the DOM element!
        // also will attach it every time the page refreshes!
        $('#display-history li').last().data('saveOperation', {
            inputOne: historyObject.inputOne,
            inputTwo: historyObject.inputTwo,
            operator: historyObject.operator
        });
    }

};


// deletes history on server
function deleteHistory() {

    $.ajax({
        method: 'DELETE',
        url: '/clear-history'
    }).then((response) => {

        // reload history data to DOM (empty's DOM)
        getHistory()
        clearInputs()

    }).catch((error) => {
        alert('History is still here....')
        console.log('deleteHistory error is:', error);
    })

};