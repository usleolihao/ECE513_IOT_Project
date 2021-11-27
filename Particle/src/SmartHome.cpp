/******************************************************/
//       THIS IS A GENERATED FILE - DO NOT EDIT       //
/******************************************************/

#include "Particle.h"
#line 1 "/Users/AXIBA/Documents/SynologyDrive/Coding/ece513/Particle/src/SmartHome.ino"
/*
 * ECE 513 Final Project Samrt Home
 * Description: 
 * Smart light / Sensor DHT11 / Publish / Reading value
 * Author: Lihao Guo, Nasser Salem Albalawi
 * Date: 11/26/2021
 */

// Please configure your project
// From the Command Palette 
//   1. select Particle: Configure Project for Device
//   2. the device OS version you'd like to build for: (use 2.2.0)
//   3. the type of device to you'd like to build for (i.e., select your device - Argon or Photon)
//   4. the name or device ID of the device you want to flash to. Just leave this blank

#include "common.h"
#include "smartlight.h"
#include "toggleLed.h"

void serialCmdProcessing();
int updateRxCmd(String cmdStr);
void cloudCmdProcessing();
void myWebhookHandler(const char *event, const char *data);
void setup();
void loop();
#line 20 "/Users/AXIBA/Documents/SynologyDrive/Coding/ece513/Particle/src/SmartHome.ino"
SYSTEM_THREAD(ENABLED); 

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Global variables
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Local Serial
CSmartLight smartLight;
CToggleLed toggleLed;
int counter_serial;
int counter_cloud;

// Particle Cloud
bool bPublish;      // enable/disable publish
String rxCloudCmdStr; // receive command via internet
String statusStr;
uint8_t ledHighLow;

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Serial Cmd Processing
/////////////////////////////////////////////////////////////////////////////////////////////////////////
void serialCmdProcessing() {
  if (Serial.available() <= 0) return;
  String cmdStr = "";
  while (Serial.available()) {
      char c = Serial.read();
      cmdStr += String(c);
  }
  JSONValue cmdJson = JSONValue::parseCopy(cmdStr.c_str());
  JSONObjectIterator iter(cmdJson);
  while (iter.next()) {
    if (iter.name() == "smartlight") {
      smartLight.cmdProcessing(iter.value());
    }
    else if (iter.name() == "led") {
      toggleLed.cmdProcessing(iter.value());
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Cloud Cmd Processing
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// function to receive command via internet
int updateRxCmd(String cmdStr) {
  //Serial.println(cmdStr.c_str());
  rxCloudCmdStr = cmdStr;
  return 0;
}

// command processing
void cloudCmdProcessing() {
  if (rxCloudCmdStr == "") return;
  JSONValue cmdJson = JSONValue::parseCopy(rxCloudCmdStr);
  JSONObjectIterator iter(cmdJson);
  while (iter.next()) {
    if (iter.name() == "publish") {
      bPublish = iter.value().toBool();
    }
  }
  rxCloudCmdStr = "";
}

// When obtain response from the publish
void myWebhookHandler(const char *event, const char *data) {
  // Formatting output
  String output = String::format("Response:  %s", data);
  // Log to serial console
  Serial.println(output);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Particle Part
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// setup() runs once, when the device is first turned on.
void setup() {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Common Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Put initialization like pinMode and begin functions here.
  pinMode(LED, OUTPUT);
  RGB.control(true);
  RGB.color(255, 255, 255);   // default color
  counter_serial = 0;
  counter_cloud = 0;
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Cloud Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  bPublish = false;
  rxCloudCmdStr = "";
  statusStr = "";
  ledHighLow = LOW;
  // remote control
  Particle.function("cloudcmd", updateRxCmd);
  // Subscribe to the webhook response event
  Particle.subscribe("hook-response/smarthome", myWebhookHandler);

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Others
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Serial.begin();
}

// loop() runs over and over again, as quickly as it can execute.
void loop() {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Common part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  unsigned long t = millis();
  unsigned long period = millis() - t;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Serial Cmd Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  serialCmdProcessing();
  if (counter_serial % (SERAIL_COMM_FREQUENCY * LOOP_FREQUENCY) == 0) {
      counter_serial = 0;
      Serial.printf("{\"t\":%d,\"light\":%s,\"led\":%s,\"ct\":%ld}", 
        (int)Time.now(), smartLight.getStatusStr().c_str(), toggleLed.getStatusStr().c_str(),
        period
      );
      Serial.println();
    }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Cloud Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  cloudCmdProcessing();
  if (counter_cloud % (PUBLISH_FREQUENCY * LOOP_FREQUENCY) == 0) {
    counter_cloud = 0;
    statusStr = String::format("{\"t\":%d}", (int)Time.now());
    if (bPublish) {
      Particle.publish("smarthome", statusStr, PRIVATE);
      if (ledHighLow == LOW) ledHighLow = HIGH;
      else ledHighLow = LOW; 
      digitalWrite(LED, ledHighLow);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Sensor Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  smartLight.execute();
  toggleLed.execute();
  

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Counter Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  counter_serial++;
  counter_cloud++;
  period = PERIOD - (millis() - t);
  if (period > 0) delay(period);  


}