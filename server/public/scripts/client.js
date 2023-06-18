$(document).ready(onReady);

let chosenOperation = '';
let inputOne = '';
let inputTwo = '';
let inputConcat = '';

function onReady() {
    console.log('jQuery loaded');

    // loads history onto page 
    getHistory()

    // button listeners!
    $('.clear-inputs').on('click', resetInputs)
    $('.clear-all').on('click', deleteHistory)
    $('#submit-button').on('click', postCalculation)
    $('.number-btn').on('click', addToInput)


    // "radio" button listener
    $('.operation-btn').on('click', selectOperationButton)

    // TODO access history data (hopefully)
    $('.history-list').on('click', checkValues)
}

// clicking "c" clears selected operator and input fields
function resetInputs() {
    // deselects and clears value of chosenOperation
    $('.operation-btn').removeClass('active');
    // clears input variables
    chosenOperation = '';
    inputOne = '';
    inputTwo = '';
    inputConcat = '';
    // clears number input value
    $('.number-input').val('')
    // clears calculated total
    $('#total').text('')
}

// TODO - all clear function 

// TODO - add numbers to inputs!
function addToInput() {
    console.log('button value is:', $(this).val());

    // if operator is true, in2, in1
    if (chosenOperation) {
        // add to input2
        inputTwo += $(this).val();
        inputConcat = inputOne + chosenOperation + inputTwo;
    } else {
        // else add to input1
        inputOne += $(this).val();
        inputConcat = inputOne + chosenOperation;
    }

    console.log('building string');
    console.log('inputOne is:', inputOne);
    console.log('inputTwo is:', inputTwo);
    console.log('chosenOperation is:', chosenOperation);
    console.log('inputConcat:', inputConcat);


    // console.log($('.number-input').val(''));
    // TODO why wont this append right!
    $('.number-input').val(inputConcat);

}

// TODO checking values of list items
function checkValues() {
    console.log('list item clicked!');
    console.log($(this).data('saveOperation'));
}



// toggles selected operation
// both value to be passed & highligh on DOM
function selectOperationButton() {
    $('#operations-group').removeClass('not-selected')
    chosenOperation = $(this).val()
    console.log('operation is:', chosenOperation);

    // $('.operation-btn').removeClass('active')
    // $(this).addClass('active')

    inputConcat = inputOne + chosenOperation;
    $('.number-input').val(inputConcat);
}



// GET & POST routes

// sends submitted calculation and operator to server.
function postCalculation(event) {
    event.preventDefault()

    if (chosenOperation === '') {
        $('.operation-btn').addClass('not-selected')
        console.log('Please select operator');
    } else if (inputTwo === '') {
        $('.number-btn').addClass('not-selected')
        console.log('Please select second operand');
    } else {
        // old captured inputs and tests 
        // let inputOne = $('.first-number').val();
        // let inputTwo = $('.second-number').val();

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
            resetInputs()

        }).catch((alert) => {
            alert("Data wasn't sent to Server.");
            console.log("post calc #s failed.");
        })
    }

}

function getHistory() {
    $.ajax({
        method: 'GET',
        url: '/calc-history'
    }).then((response) => {
        console.log('response is:', response);
        // send to render history
        renderHistory(response)
    }).catch((error) => {
        alert('History was not found');
        console.log('getHistory error is:', error);
    })
}

function renderHistory(response) {
    // console.log(response);
    console.log('in renderHistory!');
    console.log('history is:', response.history);
    console.log('response.length is:', response.history.length);

    // displays latest calc on DOM
    // runs only if there is history
    if (response.history.length > 0) {
        $('#total').text(response.lastCalc)
    }

    // clears history display
    $('#display-history ul').empty()

    // renders calcHistory to DOM
    for (const historyObject of response.history) {
        // console.log(historyObject.calcString);
        $('#display-history ul').append(`
            <li class="history-list">${historyObject.calcString}</li>
        `)
        // testing right now, should store operation in the DOM element
        // also will attach it every time the page refreshes!
        $('#display-history li').last().data('saveOperation', {
            inputOne: historyObject.inputOne,
            inputTwo: historyObject.inputTwo,
            operator: historyObject.operator
        })
    }

    // would like to attach n1 & n2 to each line
    // for later calculation

}

// TODO delete history
function deleteHistory() {
    resetInputs()

    // TODO AJAX delete history
}