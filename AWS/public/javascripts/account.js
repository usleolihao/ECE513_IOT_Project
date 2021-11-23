$.getScript( "Javascripts/validation.js", function () {
    console.log( "Validation Script loaded but not necessarily executed." );
} );


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
            $( '#zip' ).html(zipcode);
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

$().ready( function () {
    $( '#logoutbtn' ).click( logout );
    Loadinfo();
} );