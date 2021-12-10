function logout() {
    if ( confirm( "Are you sure to logout?" ) ) {
        localStorage.removeItem( "authToken" );
        localStorage.removeItem( "dashboard" );
        localStorage.clear();
        window.location = "/";
    }
}

$().ready( function () {
    $( '#logoutbtn' ).click( logout );
} );