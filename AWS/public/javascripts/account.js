// global variables
// easy adjustment of registration requirements
const namelengthmin = 2;
const passwordmin = 8;
const passwordmax = 20;
const lowerRegex = /^(?=.*[a-z])/;
const upperRegex = /^(?=.*[A-Z])/;
const digitRegex = /[\d]{1}/;
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;



// register a specified device
function registerDevice() {
    $.ajax( {
            url: '/devices/register',
            method: 'POST',
            headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
            contentType: 'application/json',
            data: JSON.stringify( { deviceId: $( "#deviceId" ).val() } ),
            dataType: 'json'
        } )
        .done( function ( data, textStatus, jqXHR ) {
            // Add new device to the device list
            $( "#addDeviceForm" ).before( `<li class='collection-item ${$("#deviceId").val()}-li'>ID: ` +
                $( "#deviceId" ).val() + ", APIKEY: " + data[ "apikey" ] + "</li>" );

            hideAddDeviceForm();
        } )
        .fail( function ( jqXHR, textStatus, errorThrown ) {
            let response = JSON.parse( jqXHR.responseText );
            $( "#error" ).html( "Error: " + response.message );
            $( "#error" ).show();
        } );
}
// delete device




//update preference
function updatePreference() {
    console.log( "Updates Preference" + $( '#dashboard' ).is( ':checked' ) );
    $.ajax( {
            url: '/user/updatepreference',
            method: 'POST',
            contentType: 'application/json',
            headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
            data: JSON.stringify( {
                dashboard: $( '#dashboard' ).is( ':checked' )
            } ),
            dataType: 'json'
        } )
        .done( function ( data, textStatus, jqXHR ) {
            alert( "successfully updated Preference panel. \n You will rediret to Preference panel after login." );
            window.localStorage.setItem( 'dashboard', data.dashboard );
        } )
        .fail( function ( data, textStatus, jqXHR ) {
            alert( "failed to update Preference panel, Please contact customer." );
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
            $( '#fullName' ).html( userinfo.fullName );
            $( '#lastAccess' ).html( moment( userinfo.lastAccess ).format( " MM/DD/YYYY HH:mm:ss" ) );
            $( '#zip' ).html( userinfo.zip );
            if ( userinfo.dashboard ) {
                $( '#dashboard' ).attr( 'checked', 'checked' );
            } else {
                $( '#account' ).attr( 'checked', 'checked' );
            }
            initZip( userinfo.zip );
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

function updateZip( zipcode ) {
    console.log( "Updates zipcode" );
    $.ajax( {
            url: '/user/updatezip',
            method: 'POST',
            contentType: 'application/json',
            headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
            data: JSON.stringify( {
                zip: zipcode
            } ),
            dataType: 'json'
        } )
        .done( function ( data, textStatus, jqXHR ) {
            alert( "successfully updated zipcode." );
            $( '#zip' ).html( zipcode );
        } )
        .fail( function ( data, textStatus, jqXHR ) {
            alert( "failed to update zipcode, Please contact customer." );
        } );

}

function initZip( zip ) {
    if ( zip == '00000' ) {
        console.log( "Please input your zip for enable weather" );
        let zipcode = prompt( "Please input your zipcode for enable weather service" );

        while ( !isValidUSZip( zipcode ) ) {
            zipcode = prompt( "Please input correct zipcode for enable weather service" );
        }

        updateZip( zipcode );

    }
}

function isValidUSZip( sZip ) {
    return /^\d{5}(-\d{4})?$/.test( sZip );
}

function logout() {
    if ( confirm( "Are you sure to logout?" ) ) {
        localStorage.removeItem( "authToken" );
        window.location = "/";
    }
}

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

$().ready( function () {
    $( '#logoutbtn' ).click( logout );
    Loadinfo();
    $( "input[name=dashboard]" ).click( updatePreference );
    $( "#updateAccInfoBtn" ).click( function () {
        window.location.replace( "edit" );
    } );
    $( "#devicesBtn" ).click( function () {
        window.location.replace( "devices" );
    } );
    $( "#registerDevice" ).click( registerDevice );
} );