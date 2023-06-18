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
    $('.inputs').on('click', resetInputs)
    $('#submit-button').on('click', postCalculation)
    $('.number-btn').on('click', addToInput)

    
    // "radio" button listener
    $('.operation-btn').on('click', selectOperationButton)


    $('.history-list').on('click', checkValues)
}

// clicking "c" clears selected operator and input fields
function resetInputs() {
    // deselects and clears value of chosenOperation
    $('.operation-btn').removeClass('active')
    chosenOperation = ''
    // clears number input value
    $('.number-input').val('')
    // clears calculated total
    $('#total').text('')
    // 
    // $('#operations-group').removeClass('not-selected')
    // console.log('operation is:',chosenOperation);
}

// TODO - all clear function 

// TODO
function addToInput() {
    // 
}

function checkValues() {
    console.log('list item clicked!');
    console.log($(this).data('saveOperation'));
}



// toggles selected operation
// both value to be passed & highligh on DOM
function selectOperationButton() {
    $('#operations-group').removeClass('not-selected')
    chosenOperation = $(this).val()
    // console.log('operation is:',chosenOperation);

    $('.operation-btn').removeClass('active')
    $(this).addClass('active')
}



// GET & POST routes

// sends submitted calculation and operator to server.
function postCalculation(event) {
    event.preventDefault()

    if (chosenOperation === '') {
        $('#operations-group').addClass('not-selected')
        console.log('Please select operator');
    } else {
        // captured inputs 
        let inputOne = $('.first-number').val();
        let inputTwo = $('.second-number').val();
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

