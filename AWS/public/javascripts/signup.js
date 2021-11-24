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

function newuser() {
    if ( !checkForm() ) {
        register();
    }
}

function register() {
    $.ajax( {
            url: '/user/signup',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify( {
                email: $( '#email' ).val(),
                fullName: $( '#fullName' ).val(),
                password: $( '#password' ).val()
            } ),
            dataType: 'json'
        } )
        .done( registerSuccess )
        .fail( registerError );
}

function registerSuccess( data, textStatus, jqXHR ) {
    if ( data.success ) {
        alert( "Your account has been created successfully!" );
        localStorage.clear();
        window.location = "login";
    } else {
        $( '#formErrors' ).html( "<span class='red-text text-darken-2'>Error: " + data.message + "</span>" );
        $( '#formErrors' ).show();
    }
}

function registerError( jqXHR, textStatus, errorThrown ) {
    if ( jqXHR.statusCode == 404 ) {
        $( '#formErrors' ).html( "<span class='red-text text-darken-2'>Server could not be reached.</p>" );
        $( '#formErrors' ).show();
    } else {
        $( '#formErrors' ).html( "<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON.message + "</span>" );
        $( '#formErrors' ).show();
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