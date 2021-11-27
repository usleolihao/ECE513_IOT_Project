function logout() {
    if ( confirm( "Are you sure to logout?" ) ) {
        localStorage.removeItem( "authToken" );
        window.location = "/";
    }
}

$().ready( function () {
    $( '#logoutbtn' ).click( logout );
} );