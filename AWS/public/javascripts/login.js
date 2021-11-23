$().ready( function () {
    if ( window.localStorage.getItem( "authToken" ) ) {
        //alert( "found login cache" )
        window.location = "account";
    }

    $( '#login' ).click( authentication );
    $( "#password" ).keypress( function ( event ) {
        if ( event.which === 13 ) { //hit enter
            authentication();
        }
    } );

} );

function authentication() {
    $.ajax( {
            url: '/user/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify( { email: $( '#email' ).val(), password: $( '#password' ).val() } ),
            dataType: 'json'
        } )
        .done( function ( data, testStatus, jqXHR ) {
            console.log( data.token );
            window.localStorage.setItem( 'authToken', data.token );
            alert( "login Successful" );
            window.location = "account";
        } )
        .fail( function ( jqXHR, testStatus, errorThrown ) {
            if ( jqXHR.status == 401 ) {
                $( '#formErrors' ).html( "<span class='red-text text-darken-2'>Error: " +
                    jqXHR.responseJSON.message + "</span>" );
                $( '#formErrors' ).show();
            } else {
                $( '#formErrors' ).html( "<span class='red-text text-darken-2'>Server could not be reached.</span>" );
                $( '#formErrors' ).show();
            }
        } );
}