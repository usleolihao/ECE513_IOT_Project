// global variables
// easy adjustment of registration requirements
const namelengthmin = 2;
const passwordmin = 8;
const passwordmax = 20;
const passwordlower = 1;
const passwordupper = 1;
const passwordnum = 1;
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Validation -------------------------------------------------------------------------
function namevalidation() {
    let name = $( '#fullName' );
    if ( name.val().length < namelengthmin ) {
        failed( name );
    } else {
        passed( name );
    }
}

function emailvalidation() {
    let email = $( '#email' );
    if ( !email.val().match( emailRegex ) ) {
        failed( email );
    } else {
        passed( email );
    }
}


// function for form validation
function checkForm() {

    function create_li( title ) {
        var li = document.createElement( "li" );
        li.appendChild( document.createTextNode( title ) );
        return li;
    }

    // storing input tags into variables
    var name = document.getElementById( "fullName" );
    var email = document.getElementById( "email" );
    var password = document.getElementById( "password" );
    var confirmPassword = document.getElementById( "passwordConfirm" );
    var ul = document.getElementById( "errorlist" );
    var div = document.getElementById( "formErrors" );
    var error = false;

    // empty ul list each time
    ul.innerHTML = '';

    // name field length check
    if ( name.value.length < 1 ) {
        ul.appendChild( create_li( "Missing full name." ) );
        error = true;
    }

    // email field check
    if ( !email.value.match( emailRegex ) ) {
        ul.appendChild( create_li( "Invalid or missing email address." ) );
        error = true;
    }

    // password field check for length
    if ( password.value.length < passwordmin ) {
        ul.appendChild( create_li( "Password must be between " + passwordmin + " and " + passwordmax + " characters." ) );
        error = true;
    }

    // password field check for length
    if ( password.value.length > passwordmax ) {
        ul.appendChild( create_li( "Password must be between " + passwordmin + " and " + passwordmax + " characters." ) );
        error = true;
    }

    // password field check for lowercase letter
    if ( password.value.search( /[^a-z]/g ) < passwordlower ) {
        ul.appendChild( create_li( "Password must contain at least " + passwordlower + " lowercase character." ) );
        error = true;
    }

    // password field check for uppercase letter
    if ( password.value.search( /[^A-Z]/g ) < passwordupper ) {
        ul.appendChild( create_li( "Password must contain at least " + passwordupper + " uppercase character." ) );
        error = true;
    }

    // password field check for numbers
    if ( password.value.search( /[0-9]/i ) < passwordnum ) {
        ul.appendChild( create_li( "Password must contain at least " + passwordnum + " digit." ) );
        error = true;
    }

    // confirm password field check
    if ( confirmPassword.value != password.value ) {
        ul.appendChild( create_li( "Password and confirmation password don't match." ) );
        error = true;
    }

    if ( error ) {
        div.style.display = "block";
    } else {
        div.style.display = "None";
    }

    return error;
}

function newuser() {
    if ( !checkForm() ) {
        alert( "ajax to register account" );
    }
}


$().ready( function () {
    $( '#fullName' ).blur( namevalidation );
    $( '#email' ).blur( emailvalidation );
    $( '#signup' ).click( newuser );
} );


// -------------------------------------------------------------------------
// Helper function
function errormessage( text ) {
    $( '#formErrors' ).css( 'display', 'block' );
    $( '#errorlist' ).append( '<li>' + text + '</li>' );
}

function clearerror() {
    $( '#formErrors' ).css( 'display', 'none' );
    $( '#errorlist' ).empty();
}

function removeerror( text ) {
    $( '#errorlist' ).remove( ":contains('" + text + "')" )
}
//<i class="fas fa-check-circle verified-passed"></i>
//<i class="far fa-times-circle verified-failed"></i>

function passed( widget ) {
    widget.parent().children( 'i' ).remove()
    widget.parent().append( '<i class="fas fa-check-circle verified-passed"></i>' );
}

function failed( widget ) {
    widget.parent().children( 'i' ).remove()
    widget.parent().append( '<i class="far fa-times-circle verified-failed"></i>' );
}