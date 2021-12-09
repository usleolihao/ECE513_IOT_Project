function weather_module() {
    let count = $( '#weather' ).length + 1;
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .attr( "id", "weather" + count )
        .addClass( "widgets weather" )
        .append(
            $( "<div/>" )
            .addClass( "weather_text" )
            .append(
                $( "<span/>" ).attr( "id", "weather_city" )
                .html( "Tucson 85741" )
            ).append(
                $( "<span/>" ).attr( "id", "weather_humidity" )
                .html( "33" )
            ).append(
                $( "<span/>" ).attr( "id", "weather_temp" )
                .html( "23" )
            ).append(
                $( "<span/>" ).attr( "id", "weather_tempmax" )
                .html( "26" )
            ).append(
                $( "<span/>" ).attr( "id", "weather_tempmin" )
                .html( "11" )
            )
            .append(
                $( "<span/>" ).attr( "id", "weather_tempfeel" )
                .html( "15" )
            )
        ).append(
            $( "<img/>" )
            .attr( "id", "weather_icon" )
            .attr( "src", "images/weather_svg/day_clear.svg" )
        )
    );
    checkweather();
}


function checkweather() {
    $.ajax( {
        url: '/user/weather',
        method: 'POST',
        headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
        contentType: 'application/json',
        dataType: 'json'
    } ).done( function ( data, textStatus, jqXHR ) {
        if ( data.success ) {
            UpdateWidget( data.message );
        }
    } ).fail( function ( data, textStatus, jqXHR ) {
        console.log( data, textStatus, jqXHR );
    } );
}

function temperature_module() {
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .addClass( "widgets temperature" )
        .append(
            $( "<h4/>" )
            .text( "Temperature" )
        ).append(
            $( "<span/>" )
            .attr( "id", "Temperature_Celcius" )
            .html( "23" )
        ).append(
            $( "<span/>" )
            .attr( "id", "Temperature_Farenheit" )
            .html( "75" )
        )
    );
}

function humidity_module() {
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .addClass( "widgets humidity" )
        .append(
            $( "<h4/>" ).text( "Humidity" )
        ).append(
            $( "<span/>" ).attr( "id", "humidity" )
            .html( "7.5" )
        )
    );
}


function doorstatus_module() {
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .addClass( "widgets doorstatus" )
        .append(
            $( "<h4/>" )
            .text( "Door Status" ) )
        .append(
            $( "<span/>" )
            .attr( "id", "doorstatus" )
            .html( "OFF" )
        )
    );
}



/* <div class="toggleswitch">
 *       <input type="checkbox" name="toggleswitch" class="toggleswitch-checkbox" id="smartlightonoff" onchange="smartLightControl('on', this.checked)">
 *       <label class="toggleswitch-label" for="smartlightonoff">
 *            <span class="toggleswitch-inner onoffSwitchText"></span>
 *            <span class="toggleswitch-switch"></span>
 *       </label>
 * </div> 
 */
const led_on = "images/led/ledon.png";
const led_off = "images/led/ledoff.png";

function LED_module() {
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .addClass( "widgets led" )
        .append(
            $( "<h4/>" ).text( "Smart Light" )
        ).append(
            $( "<img/>" )
            .attr( "id", "smartlightonoff" )
            .attr( "src", "images/led/ledoff.png" )
            .click( function () {
                let state = ( $( "#smartlightonoff" ).attr( "src" ) === led_off );
                if ( state ) {
                    smartLightControl( 'on', true );
                } else {
                    smartLightControl( 'on', false );
                }
            } )
        )
    );
}

function power_module() {
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .addClass( "widgets power" )
        .append(
            $( "<h4/>" ).text( "Power Used" )
        ).append(
            $( "<span/>" )
            .attr( "id", "power_cons" )
            .html( "0kw" )
        )
    );
}

function AC_module() {
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .addClass( "widgets acheater" )
        .append(
            $( "<h4/>" ).text( "AC/Heater" )
        ).append(
            $( "<span/>" )
            .attr( "id", "ac_status" )
            .html( "Paused" )
        )
    );
}

function Thermostat_module() {
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .addClass( "widgets thermostat" )
        .append(
            $( "<h4/>" ).text( "Thermostat" )
        ).append(
            $( "<div/>" )
            .addClass( "acmode_selector" )
            .append(
                $( "<input/>" )
                .attr( "id", "ac_off" )
                .attr( "type", "radio" )
                .attr( "name", "ac_mode" )
                .attr( "value", "off" )
                .attr('checked', 'checked')
            ).append(
                $( "<label/>" )
                .addClass( "acmode ac_off" )
                .attr( "for", "ac_off" )
            ).append(
                $( "<input/>" )
                .attr( "id", "ac_cool" )
                .attr( "type", "radio" )
                .attr( "name", "ac_mode" )
                .attr( "value", "cool" )
            ).append(
                $( "<label/>" )
                .addClass( "acmode ac_cool" )
                .attr( "for", "ac_cool" )
            ).append(
                $( "<input/>" )
                .attr( "id", "ac_heat" )
                .attr( "type", "radio" )
                .attr( "name", "ac_mode" )
                .attr( "value", "heat" )
            ).append(
                $( "<label/>" )
                .addClass( "acmode ac_heat" )
                .attr( "for", "ac_heat" )
            ).append(
                $( "<input/>" )
                .attr( "id", "ac_auto" )
                .attr( "type", "radio" )
                .attr( "name", "ac_mode" )
                .attr( "value", "auto" )
            ).append(
                $( "<label/>" )
                .addClass( "acmode ac_auto" )
                .attr( "for", "ac_auto" )
            )
        ).append(
            $( "<div/>" )
            .addClass( "ac_dial" )
            .append(
                $( "<button/>" )
                .addClass( "waves-effect waves-light btn" )
                .attr( "id", "ac_temp_down" )
                .html( "-" )
            )
            .append(
                $( "<span/>" )
                .attr( "id", "ac_set_temp" )
                .html( "83" )
            )
            .append(
                $( "<button/>" )
                .addClass( "waves-effect waves-light btn" )
                .attr( "id", "ac_temp_up" )
                .html( "+" )
            )
        )
    );
}

function historyTH_module() {
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .addClass( "widgets thhistory" )
        .append(
            $( "<h4/>" ).text( "Temp/Hum/Power History" )
        ).append(
            $( "<span/>" )
            //.attr( "id", "hourhistory" )
            .html( "24 hours history" )
        ).append(
            $( "<textarea/>" )
            .attr( "id", "hourhistory" )
        ).append(
            $( "<span/>" )
            //.attr( "id", "dayhistory" )
            .html( "Week history" )
        ).append(
            $( "<textarea/>" )
            .attr( "id", "dayhistory" )
        )


    );
}

function warning_module() {
    $( "div#subpanel1" ).append(
        $( '<div/>' )
        .addClass( "widgets warning" )
        .append(
            $( "<h4/>" ).text( "Warning" )
        ).append(
            $( "<span/>" )
            .attr( "id", "warningtext" )
            .html( "All good" )
        )
    );
    $( '.warning' ).hide();
}

function UpdateWidget( data ) {
    if ( 'weather' === data.cmd ) {
        let zip = data.zip;
        let city = data.data.name;
        $( '#weather_city' ).html( city + " " + zip );

        let humidity = data.data.main.humidity;
        $( '#weather_humidity' ).html( humidity );

        let temp = data.data.main.temp;
        $( '#weather_temp' ).html( temp );

        let temp_max = data.data.main.temp_max;
        $( '#weather_tempmax' ).html( temp_max );

        let temp_min = data.data.main.temp_min;
        $( '#weather_tempmin' ).html( temp_min );

        let feels_like = data.data.main.feels_like;
        $( '#weather_tempfeel' ).html( feels_like );

        let weather = data.data.weather[ 0 ].main;
        let icon = "images/weather_svg/day_" + weather.toLowerCase() + ".svg";
        $( '#weather_icon' ).attr( "src", icon )
        console.log( icon );
    }
}