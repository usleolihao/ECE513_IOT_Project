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


$().ready( function () {
    Loadinfo();
    $( "#toaccount" ).click( function () {
        window.location.replace( "account" );
    } );
    $( '#edit' ).click( updateall );
    $( '#deleteaccount' ).click( deleteAccout );
} );