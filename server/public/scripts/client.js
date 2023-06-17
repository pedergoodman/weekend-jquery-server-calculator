$(document).ready(onReady);

let chosenOperation = '';

function onReady() {
    console.log('jQuery loaded');

    // needed if we start at 0 calcs?
    getHistory()


    // button listeners!
    $('#clear-inputs').on('click', resetInputs)
    $('#submit-button').on('click', postCalculation)


    // "radio" button listener
    $('.operation-btn').on('click', selectOperationButton)
}

// clicking "c" clears selected operator and input fields
function resetInputs() {
    $('.operation-btn').removeClass('active')
    chosenOperation = ''
    $('.number-input').val('')
    // console.log('operation is:',chosenOperation);
}

// toggles selected operation
// both value to be passed & highligh on DOM
function selectOperationButton() {
    chosenOperation = $(this).val()
    console.log('operation is:',chosenOperation);
    
    $('.operation-btn').removeClass('active')
    $(this).addClass('active')
}

// sends submitted calculation and operator to server.
function postCalculation(event) {
    event.preventDefault()
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

        // send to getHistory
        getHistory()


    }).catch((alert) => {
        alert("Data wasn't sent to Server.");
        console.log("post calc #s failed.");
    })


}

function getHistory() {
    
}
