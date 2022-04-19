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
            .html( "0" )
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
            .html( "OFF" )
        )
    );
}

var set_temp = 74

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
                .attr( 'checked', 'checked' )
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
                .html( set_temp )
            )
            .append(
                $( "<button/>" )
                .addClass( "waves-effect waves-light btn" )
                .attr( "id", "ac_temp_up" )
                .html( "+" )
            )
        )
    );

    $( "#ac_temp_up" ).click( function () {
        set_actemp( set_temp + 1 );
    } );

    $( "#ac_temp_down" ).click( function () {
        set_actemp( set_temp - 1 );
    } );

    $( 'input:radio[name=ac_mode]' ).change( function () {
        set_acmode();
    } );
}

function set_acmode() {
    try {
        let device = $( '#online_device_list' ).find( ":selected" ).val();
        device = JSON.parse( device );
        let acmode = $( 'input:radio[name=ac_mode]:checked' ).val();
        let modes = { "off": 0, "cool": 1, "heat": 2, "auto": 3 };
        let txcmd = {
            cmd: "write",
            deviceid: device.id,
            deviceapi: device.api,
            data: {
                acmode: modes[ acmode ]
            }
        };
        //console.log( JSON.stringify( txcmd ) );
        onlineCmd( txcmd );
    } catch ( err ) {
        //console.log( err );
        alert( "No available device." );
        window.location = 'device';
    }
}

function set_actemp( value ) {
    try {
        let device = $( '#online_device_list' ).find( ":selected" ).val();
        device = JSON.parse( device );
        let txcmd = {
            cmd: "write",
            deviceid: device.id,
            deviceapi: device.api,
            data: {
                temp: value
            }
        };
        //console.log( JSON.stringify( txcmd ) );
        onlineCmd( txcmd );
    } catch ( err ) {
        //console.log( err );
        alert( "No available device." );
        window.location = 'device';
    }
}

function getRandomInt( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * ( max - min ) + min ); //The maximum is exclusive and the minimum is inclusive
}

var hourlabels = [];
var hourtemp = [];
var hourhum = [];
var hourpower = [];
var daylabels = [];
var daytemp = [];
var dayhum = [];
var daypower = [];
var weeklabels = [];
var weektemp = [];
var weekhum = [];
var weekpower = [];

for ( var i = 0; i < 24 + 1; i++ ) {
    hourlabels.push( i.toString() );
    hourtemp.push( getRandomInt( 0, 1 ) );
    hourhum.push( getRandomInt( 0, 1 ) );
    hourpower.push( getRandomInt( 0, 1 ) );
}

for ( var i = 0; i < 7 + 1; i++ ) {
    daylabels.push( i.toString() );
    daytemp.push( getRandomInt( 0, 1 ) );
    dayhum.push( getRandomInt( 0, 1 ) );
    daypower.push( getRandomInt( 0, 1 ) );
}

for ( var i = 0; i < 30 + 1; i++ ) {
    weeklabels.push( i.toString() );
    weektemp.push( getRandomInt( 0, 1 ) );
    weekhum.push( getRandomInt( 0, 1 ) );
    weekpower.push( getRandomInt( 0, 1 ) );
}

var hourdata = {
    labels: hourlabels,
    datasets: [ {
            label: 'Temperature',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: hourtemp,
        },
        {
            label: 'Humidity',
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: hourhum,
        }, {
            label: 'Power Used',
            backgroundColor: 'rgb(255, 205, 86)',
            borderColor: 'rgb(255, 205, 86)',
            data: hourpower,
        }
    ]
};

var daydata = {
    labels: daylabels,
    datasets: [ {
            label: 'Temperature',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: daytemp,
        },
        {
            label: 'Humidity',
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: dayhum,
        }, {
            label: 'Power Used',
            backgroundColor: 'rgb(255, 205, 86)',
            borderColor: 'rgb(255, 205, 86)',
            data: daypower,
        }
    ]
};

var weekdata = {
    labels: weeklabels,
    datasets: [ {
            label: 'Temperature',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: weektemp,
        },
        {
            label: 'Humidity',
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: weekhum,
        }, {
            label: 'Power Used',
            backgroundColor: 'rgb(255, 205, 86)',
            borderColor: 'rgb(255, 205, 86)',
            data: weekpower,
        }
    ]
};

var hourconfig = {
    type: 'line',
    data: hourdata,
    options: {}
};

var dayconfig = {
    type: 'line',
    data: daydata,
    options: {}
};

var weekconfig = {
    type: 'line',
    data: weekdata,
    options: {}
};

var hourchart = null;
var weekchart = null;
var monthchart = null;

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
            $( "<canvas/>" )
            .attr( "id", "hourhistory" )
        ).append(
            $( "<span/>" )
            //.attr( "id", "dayhistory" )
            .html( "Week history" )
        ).append(
            $( "<canvas/>" )
            .attr( "id", "dayhistory" )
        ).append(
            $( "<span/>" )
            .html( "Month history" )
        )
        .append(
            $( "<canvas/>" )
            .attr( "id", "monthhistory" )
        )
    );

    hourchart = new Chart(
        $( '#hourhistory' ),
        hourconfig
    );

    weekchart = new Chart(
        $( '#dayhistory' ),
        dayconfig
    );

    monthchart = new Chart(
        $( '#monthhistory' ),
        weekconfig
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

function removeData( chart ) {
    chart.data.labels.pop();
    chart.data.datasets.forEach( ( dataset ) => {
        dataset.data.pop();
    } );
    chart.update();
}

function addData( chart, label, data ) {
    chart.data.labels.push( label );
    chart.data.datasets.forEach( ( dataset ) => {
        dataset.data.push( data );
    } );
    chart.update();
}
