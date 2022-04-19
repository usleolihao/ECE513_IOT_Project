function errormsg( msg ) {
    $( "#error" ).html( "Error: " + msg );
    $( "#error" ).show();
}

// register a specified device
function registerDevice() {
    if ( $( "#deviceid" ).val() && $( "#deviceapi" ).val() ) {
        $.ajax( {
                url: '/device/register',
                method: 'POST',
                headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
                contentType: 'application/json',
                data: JSON.stringify( {
                    deviceid: $( "#deviceid" ).val(),
                    deviceapi: $( "#deviceapi" ).val()
                } ),
                dataType: 'json'
            } )
            .done( function ( data, textStatus, jqXHR ) {
                if ( !data.success ) {
                    errormsg( data.data.error_description );
                } else {
                    console.log( data );
                    location.reload();
                }

            } )
            .fail( function ( jqXHR, textStatus, errorThrown ) {
                let response = JSON.parse( jqXHR.responseJSON );
                errormsg( response.message );
            } );
    } else {
        errormsg( "Device Id and Device API can not be empty." );
    }

}

// delete device
function deletedevice( deviceid, deviceapi ) {
    if ( deviceid && deviceapi ) {
        $.ajax( {
                url: '/device/remove',
                method: 'POST',
                headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
                contentType: 'application/json',
                data: JSON.stringify( {
                    deviceid: deviceid,
                    deviceapi: deviceapi
                } ),
                dataType: 'json'
            } )
            .done( function ( data, textStatus, jqXHR ) {
                alert( data.message );
                location.reload();
            } )
            .fail( function ( jqXHR, textStatus, errorThrown ) {
                let response = jqXHR.responseJSON;
                errormsg( response.message );
            } );

    } else {
        errormsg( "Device Id is required." );
    }
}

// list devices
function listdevices() {
    $.ajax( {
            url: '/device/list',
            method: 'GET',
            headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
            dataType: 'json'
        } ).done( function ( data, textStatus, jqXHR ) {
            // Add new device to the device list
            //$( "#addDeviceForm" ).before( `<li class='collection-item ${$("#deviceId").val()}-li'>ID: ` +
            //    $( "#deviceId" ).val() + ", APIKEY: " + data[ "apikey" ] + "</li>" );
            //console.log( data );
            if ( data.success ) {
                //console.log( data.devices.devices );
                for ( let device in data.devices.devices ) {
                    //console.log( data.devices.devices[device].deviceid );
                    let deviceid = data.devices.devices[ device ].deviceid;
                    let deviceapi = data.devices.devices[ device ].deviceapi;
                    removebtn = `<button class="waves-effect waves-light btn" id="device${device}">Delete</button>`;
                    eachline = `<li class='collection-item device${device}-list'>Device ${device}:<br>ID: ${deviceid} ${removebtn}</li>`

                    $( "#addDeviceForm" ).before( eachline );
                    $( `#device${device}` ).click( function () {
                        deletedevice( deviceid, deviceapi )
                    } );

                }

            }
        } )
        .fail( function ( jqXHR, textStatus, errorThrown ) {
            let response = JSON.parse( jqXHR.responseJSON );
            errormsg( response.message );
        } );
}