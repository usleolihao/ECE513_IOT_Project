#ifndef _COMMON_H_
#define _COMMON_H_

#include "Particle.h"

#define PERIOD     100
#define LOOP_FREQUENCY   (1000/PERIOD)   // Loop frequency
// Blue led
#define LED         D7
#define TOGGLE_FREQUENCY    1       // 1 Hz

// RGB led
#define RGB_BRIGHTNESS_MAX      255
#define RGB_BRIGHTNESS_DEAULT   128
// photoresistor
#define LIGHT_SENSOR        A0
#define LIGHT_SENSOR_MIN    500
#define LIGHT_SENSOR_MAX    2500

// command
#define INVALID_CMD         -99999

// serial communication
#define SERAIL_COMM_FREQUENCY   1   // 1 Hz

#endif