#ifndef _COMMON_H_
#define _COMMON_H_

#include "Particle.h"

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Comunication Frequency
/////////////////////////////////////////////////////////////////////////////////////////////////////////
#define PERIOD 1000
#define LOOP_FREQUENCY (1000 / PERIOD) // Loop frequency
// serial communication
#define SERAIL_COMM_FREQUENCY 1 // 1 Hz
// cloud communication
#define PUBLISH_FREQUENCY 1 // 1 Hz

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// LED/RGB Setting
////////////////////////////˝/////////////////////////////////////////////////////////////////////////////
// Blue led
#define LED D3
#define TOGGLE_FREQUENCY 1 // 1 Hz

// RGB led
#define RGB_BRIGHTNESS_MAX 255
#define RGB_BRIGHTNESS_DEAULT 128

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Photoresistor Setting
////////////////////////////˝/////////////////////////////////////////////////////////////////////////////

// photoresistor
#define LIGHT_SENSOR A0
#define LIGHT_SENSOR_MIN 500
#define LIGHT_SENSOR_MAX 2500

#define DOOR_SENSOR A2
#define DOOR_SENSOR_MIN 500
#define DOOR_SENSOR_MAX 2500

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// DHT sensor Setting
////////////////////////////˝/////////////////////////////////////////////////////////////////////////////
// Pin where the DHT sensor is connected to
#define DHTPIN D1
// The type of DHT sensor being used
#define DHTTYPE DHT11

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Other Setting
////////////////////////////˝/////////////////////////////////////////////////////////////////////////////
// command
#define INVALID_CMD -99999

#endif