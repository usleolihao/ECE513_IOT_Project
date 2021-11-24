$().ready( function () {
    $( "#toaccount" ).click( function () {
        window.location.replace( "account" );
    } );
    listdevices();
    $( "#registerdevice" ).click( registerDevice );
    $( "#deletedevice" ).click( function () {
        let id = $( "#deviceid" ).val();
        let api = $( "#deviceapi" ).val();
        if ( id && api ) {
            deletedevice( id, api );
        } else {
            errormsg( "Device Id and Device API can not be empty." );
        }
    } );
} );