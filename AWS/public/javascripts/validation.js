// global variables
// easy adjustment of registration requirements
const namelengthmin = 2;
const passwordmin = 8;
const passwordmax = 20;
const lowerRegex = /^(?=.*[a-z])/;
const upperRegex = /^(?=.*[A-Z])/;
const digitRegex = /[\d]{1}/;
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


// function for form validation
function checkForm() {

    function create_li( title ) {
        var li = document.createElement( "li" );
        li.appendChild( document.createTextNode( title ) );
        ul.appendChild( li );
    }

    function lowercount( string ) {
        return string.match( /[a-z]/g ).length
    }

    function uppercount( string ) {
        return string.match( /[a-z]/g ).length
    }

    // storing input tags into variables
    var name = document.getElementById( "fullName" );
    var email = document.getElementById( "email" );
    var password = document.getElementById( "password" );
    var confirmPassword = document.getElementById( "passwordConfirm" );
    var error = false;

    // empty ul list each time
    var div = document.getElementById( "formErrors" );
    div.innerHTML = '';
    // var ul = document.getElementById( "errorlist" );
    var ul = document.createElement( "ul" );
    ul.setAttribute( "id", "errorlist" );
    div.appendChild( ul );

    // name field length check
    if ( name.value.length < 1 ) {
        create_li( "Missing full name." );
        error = true;
    }

    // email field check
    if ( !emailRegex.test( email.value ) ) {
        create_li( "Invalid or missing email address." );
        error = true;
    }

    // password field check for length
    if ( password.value.length < passwordmin ) {
        create_li( "Password must be between " + passwordmin + " and " + passwordmax + " characters." );
        error = true;
    }

    // password field check for length
    if ( password.value.length > passwordmax ) {
        create_li( "Password must be between " + passwordmin + " and " + passwordmax + " characters." );
        error = true;
    }

    // password field check for lowercase letter
    if ( !lowerRegex.test( password.value ) ) {
        create_li( "Password must contain at least one lowercase character." );
        error = true;
    }

    // password field check for uppercase letter
    if ( !upperRegex.test( password.value ) ) {
        create_li( "Password must contain at least one uppercase character." );
        error = true;
    }

    // password field check for numbers
    if ( !digitRegex.test( password.value ) ) {
        create_li( "Password must contain at least one digit." );
        error = true;
    }

    // confirm password field check
    if ( confirmPassword.value != password.value ) {
        create_li( "Password and confirmation password don't match." );
        error = true;
    }

    if ( error ) {
        div.style.display = "block";
    } else {
        div.style.display = "None";
    }

    return error;
}


// function for form validation
function checkPassword() {

    function create_li( title ) {
        var li = document.createElement( "li" );
        li.appendChild( document.createTextNode( title ) );
        ul.appendChild( li );
    }

    // storing input tags into variables
    var name = document.getElementById( "fullName" );
    var password = document.getElementById( "password" );
    var confirmPassword = document.getElementById( "passwordConfirm" );
    var error = false;

    // empty ul list each time
    var div = document.getElementById( "formErrors" );
    div.innerHTML = '';
    // var ul = document.getElementById( "errorlist" );
    var ul = document.createElement( "ul" );
    ul.setAttribute( "id", "errorlist" );
    div.appendChild( ul );

    // name field length check
    if ( name.value.length < 1 ) {
        create_li( "Missing full name." );
        error = true;
    }

    // password field check for length
    if ( password.value.length < passwordmin ) {
        create_li( "Password must be between " + passwordmin + " and " + passwordmax + " characters." );
        error = true;
    }

    // password field check for length
    if ( password.value.length > passwordmax ) {
        create_li( "Password must be between " + passwordmin + " and " + passwordmax + " characters." );
        error = true;
    }

    // password field check for lowercase letter
    if ( !lowerRegex.test( password.value ) ) {
        create_li( "Password must contain at least one lowercase character." );
        error = true;
    }

    // password field check for uppercase letter
    if ( !upperRegex.test( password.value ) ) {
        create_li( "Password must contain at least one uppercase character." );
        error = true;
    }

    // password field check for numbers
    if ( !digitRegex.test( password.value ) ) {
        create_li( "Password must contain at least one digit." );
        error = true;
    }

    // confirm password field check
    if ( confirmPassword.value != password.value ) {
        create_li( "Password and confirmation password don't match." );
        error = true;
    }

    if ( error ) {
        div.style.display = "block";
    } else {
        div.style.display = "None";
    }

    return error;
}