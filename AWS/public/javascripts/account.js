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
            alert( "successfully updated Preference panel. \nYou will rediret to Preference panel after login." );
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
            window.localStorage.setItem( 'dashboard', userinfo.dashboard );
            initZip( userinfo.zip );
            

            //list devices
            listdevices();

        } )
        .fail( function ( jqXHR, textStatus, errorThrown ) {
            //remove stored token from web browser and redirect to login page
            if ( jqXHR.status == 401 ) {
                alert( "Invalid authentication." );
            } else {
                alert( "Please contact customer. Unknow error: " + jqXHR.status );
            }
            window.localStorage.removeItem( "authToken" );
            window.localStorage.clear();
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

$().ready( function () {
    Loadinfo();
    $( "input[name=dashboard]" ).click( updatePreference );
    $( "#updateAccInfoBtn" ).click( function () {
        window.location.replace( "edit" );
    } );
    $( "#devicesBtn" ).click( function () {
        window.location.replace( "devices" );
    } );
    $( "#registerdevice" ).click( registerDevice );
    $( "#deletedevice" ).click( function () {
        let id = $( "#deviceid" ).val();
        let api = $( "#deviceapi" ).val();
        if ( id && api ) {
            deletedevice( id, api );
        } else {
            alert( "Device Id and Device API can not be empty." );
        }
    } );
} );