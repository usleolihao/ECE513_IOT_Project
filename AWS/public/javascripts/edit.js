// global variables
// easy adjustment of registration requirements
const namelengthmin = 2;
const passwordmin = 8;
const passwordmax = 20;
const lowerRegex = /^(?=.*[a-z])/;
const upperRegex = /^(?=.*[A-Z])/;
const digitRegex = /[\d]{1}/;
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


function deleteAccout() {
    if ( $( '#cpassword' ).val() === '' ) {
        alert( "Please input your Current Password for deleting account. " )
    } else {
        $.ajax( {
                url: '/user/deleteaccount',
                method: 'POST',
                contentType: 'application/json',
                headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
                data: JSON.stringify( {
                    password: $( '#cpassword' ).val()
                } ),
                dataType: 'json'
            } )
            .done( function ( data, textStatus, jqXHR ) {
                localStorage.clear();
                alert( data.message );
                window.location = '/';
            } )
            .fail( function ( data, textStatus, jqXHR ) {
                alert( "failed to delete account, Please check your password." );
            } );
    }

}


function updateall() {
    // if password is empty, just change other info
    // othewise check the password
    if ( $( '#cpassword' ).val() === '' ) {
        console.log( "Updates General Account Information" );
        updateinfo( 0 );
    } else if ( !checkPassword() ) {
        console.log( "Updates Account Information and Password" );
        updateinfo( 1 );
    }
}

function updateinfo( updatetype ) {
    console.log( "Updates Account Information" );
    let updateinfo = {
        fullName: $( '#fullName' ).val(),
        zip: $( '#zip' ).val(),
        dashboard: $( '#dashboard' ).is( ':checked' )
    }
    if ( updatetype === 1 ) {
        updateinfo[ 'cpassword' ] = $( '#cpassword' ).val();
        updateinfo[ 'password' ] = $( '#password' ).val();
    }

    $.ajax( {
            url: '/user/updateall',
            method: 'POST',
            contentType: 'application/json',
            headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
            data: JSON.stringify( updateinfo ),
            dataType: 'json'
        } )
        .done( function ( data, textStatus, jqXHR ) {
            //alert( "successfully updated account information." );
            alert( data.message );
            $( '#cpassword' ).val( '' );
            $( '#password' ).val( '' );
            $( '#passwordConfirm' ).val( '' );
        } )
        .fail( function ( data, textStatus, jqXHR ) {
            $( '#formErrors' ).show();
            if ( !typeof data.responseJSON.message === 'undefined' ) {
                $( '#formErrors' ).html( data.responseJSON.message );
                alert( textStatus );
            }
            //alert( "failed to update account information, Please contact customer." );
        } );
}


// Load the information when user login
function Loadinfo() {
    console.log( "authentication of account" );
    $.ajax( {
            url: '/user/account',
            method: 'GET',
            headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
            dataType: 'json'
        } )
        .done( function ( userinfo, textStatus, jqXHR ) {
            console.log( "Loading information" );
            $( '#email' ).html( userinfo.email );
            $( '#fullName' ).val( userinfo.fullName );
            $( "label[for='fullName']" ).addClass( "active" );
            $( '#zip' ).val( userinfo.zip );
            $( "label[for='zip']" ).addClass( "active" );
            if ( userinfo.dashboard ) {
                $( '#dashboard' ).attr( 'checked', 'checked' );
            } else {
                $( '#account' ).attr( 'checked', 'checked' );
            }
            $( '#lastAccess' ).html( moment( userinfo.lastAccess ).format( " MM/DD/YYYY HH:mm:ss" ) );
        } )
        .fail( function ( jqXHR, textStatus, errorThrown ) {
            //remove stored token from web browser and redirect to login page
            if ( jqXHR.status == 401 ) {
                alert( "Invalid authentication." );
            } else {
                alert( "Please contact customer. Unknow error: " + jqXHR.status );
            }
            window.localStorage.removeItem( "authToken" );
            window.location = "login";
        } );
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

function logout() {
    if ( confirm( "Are you sure to logout?" ) ) {
        localStorage.removeItem( "authToken" );
        window.location = "/";
    }
}

$().ready( function () {
    $( '#logoutbtn' ).click( logout );
    Loadinfo();
    $( "#toaccount" ).click( function () {
        window.location.replace( "account" );
    } );
    $( '#edit' ).click( updateall );
    $( '#deleteaccount' ).click( deleteAccout );
} );