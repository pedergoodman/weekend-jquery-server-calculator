$(document).ready(onReady);

let chosenOperation = '';
let inputOne = '';
let inputTwo = '';
let inputConcat = '';
let submitted = false;

function onReady() {
    console.log('jQuery loaded');

    // loads history onto page 
    getHistory()

    // button listeners!
    // clear buttons
    $('.clear-inputs').on('click', clearInputs)
    $('.clear-all').on('click', deleteHistory)

    // input / submission buttons
    $('#submit-button').on('click', postCalculation)
    $('.number-btn').on('click', addToInput)


    // "radio" button listener 
    $('.operation-btn').on('click', selectOperationButton)

    // TODO access history data (hopefully)
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

function resetInputValues() {
    chosenOperation = '';
    inputOne = '';
    inputTwo = '';
    inputConcat = '';
}



// TODO - add numbers to inputs!


function addToInput() {
    // console.log('button value is:', $(this).val());
    if (submitted) {
        clearInputs()
        submitted = false;
    }
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

// toggles selected operation
// both value to be passed & highligh on DOM
function selectOperationButton() {
    $('.operation-btn').removeClass('not-selected')
    chosenOperation = $(this).val()
    // console.log('operation is:', chosenOperation);

    // old functionality, keeps selected operation highlighted
    // $('.operation-btn').removeClass('active')
    // $(this).addClass('active')

    inputConcat = inputOne + chosenOperation + inputTwo;
    $('.number-input').val(inputConcat);
}

// GET & POST routes
function checkReadyToCalculate() {
    if (chosenOperation === '') {
        // flash operation buttons
        $('.operation-btn').addClass('not-selected')
        setTimeout(() => {
            $('.operation-btn').removeClass('not-selected')
        }, "100")
        // console.log('Please select operator');
        return false;
    } else if (inputTwo === '') {
        $('.number-btn').addClass('not-selected')
        setTimeout(() => {
            $('.number-btn').removeClass('not-selected')
        }, "100")
        console.log('Please select second operand');
        return false;
    } else {
        return true;
    }

}


// sends submitted calculation and operator to server.
function postCalculation(event) {
    event.preventDefault()

    if (checkReadyToCalculate()) {
        // tests & old captured inputs 
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
            submitted = true;

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
        // console.log('response is:', response);
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

}

// TODO delete history
function deleteHistory() {

    // TODO AJAX delete history
    $.ajax({
        method: 'DELETE',
        url: '/clear-history'
    }).then((response) => {

        getHistory()
        clearInputs()

    }).catch((error) => {
        alert('History is still here....')
        console.log('deleteHistory error is:', error);
    })

}