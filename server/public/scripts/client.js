$(document).ready(onReady);

let operationButton = '';

function onReady() {
    console.log('jQuery loaded');

    // needed if we start at 0 calcs?
    // getHistory()


    // button listeners!

    // "radio" button listener
    $('.operation-btn').on('click', selectButton)

}

function selectButton() {
    operationButton = $(this).val()
    console.log(operationButton);
    
    $('.operation-btn').removeClass('active')
    $(this).addClass('active')
}

