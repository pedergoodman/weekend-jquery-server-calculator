const { log } = require("console");
const { response } = require("express");

$(document).ready(onReady);

let chosenOperation = '';

function onReady() {
    console.log('jQuery loaded');

    // needed if we start at 0 calcs?
    // getHistory()


    // button listeners!

    // "radio" button listener
    $('.operation-btn').on('click', selectOperationButton)
    $('#clear-inputs').on('click', resetInputs)
    $('#submit-button').on('click', postCalculation)
}

function resetInputs() {
    $('.operation-btn').removeClass('active')
    chosenOperation = ''
    $('.number-input').val('')
    // console.log('operation is:',chosenOperation);
}

function selectOperationButton() {
    chosenOperation = $(this).val()
    // console.log('operation is:',chosenOperation);
    
    $('.operation-btn').removeClass('active')
    $(this).addClass('active')
}

function postCalculation() {
    // captured inputs 
    let inputOne = $('.first-number').val();
    let inputTwo = $('.second-number').val();
    console.log('inputOne is:', inputOne);
    console.log('inputTwo is:', inputTwo);

    // POST route to server, 
    // package 2 numbers & chosen math operation
    $.ajax({
        method: 'POST',
        url: '/send-calc',
        data: {
            calcInputData: {
                inputOne: inputOne,
                inputTwo: inputTwo,
                mathOperation: chosenOperation
            }
        }
    }).then((response) => {
        console.log('Post Successful');
        // TODO render data to DOM

    }).catch((alert) => {
        alert("Data wasn't sent to Server.");
        console.log("post calc #s failed.");
    })


}





// move to server later
