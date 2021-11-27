/*
 * ECE 513 Final Project Samrt Home
 * Description: 
 * Smart light / Sensor DHT11 / Publish / Reading value
 * Author: Lihao Guo, Nasser Salem Albalawi
 * Date: 11/27/2021
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
#include "DHT.h"

// The following line is optional, but recommended in most firmware.
// It allows your code to run before the cloud is connected.
SYSTEM_THREAD(ENABLED);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Global variables
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// This uses the USB serial port for debugging logs.
SerialLogHandler logHandler;

// Sensor Variables
CSmartLight smartLight;
CToggleLed toggleLed;

// Connect pin 1 (on the left) of the sensor to +5V or 3.3V
// Connect pin 2 of the sensor to whatever your DHTPIN# is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor for stand alone sensors
DHT dht(DHTPIN, DHTTYPE);

// Declaring integer variables, which they will be
// used later to store the values of the photoresistors.
int smart_light_analogvalue;
int door_analogvalue;

// Counter
int counter_serial;
int counter_cloud;

// Variables for Particle Cloud
bool bPublish;        // enable/disable publish
String rxCloudCmdStr; // receive command via internet
String statusStr;
uint8_t ledHighLow;

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Serial Cmd Processing
/////////////////////////////////////////////////////////////////////////////////////////////////////////
void serialCmdProcessing()
{
  if (Serial.available() <= 0)
    return;
  String cmdStr = "";
  while (Serial.available())
  {
    char c = Serial.read();
    cmdStr += String(c);
  }
  JSONValue cmdJson = JSONValue::parseCopy(cmdStr.c_str());
  JSONObjectIterator iter(cmdJson);
  while (iter.next())
  {
    if (iter.name() == "smartlight")
    {
      smartLight.cmdProcessing(iter.value());
    }
    else if (iter.name() == "led")
    {
      toggleLed.cmdProcessing(iter.value());
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Cloud Cmd Processing
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// function to receive command via internet
int updateRxCmd(String cmdStr)
{
  //Serial.println(cmdStr.c_str());
  rxCloudCmdStr = cmdStr;
  return 0;
}

// command processing
void cloudCmdProcessing()
{
  if (rxCloudCmdStr == "")
    return;
  JSONValue cmdJson = JSONValue::parseCopy(rxCloudCmdStr);
  JSONObjectIterator iter(cmdJson);
  while (iter.next())
  {
    if (iter.name() == "publish")
    {
      bPublish = iter.value().toBool();
    }
  }
  rxCloudCmdStr = "";
}

// When obtain response from the publish
void myWebhookHandler(const char *event, const char *data)
{
  // Formatting output
  String output = String::format("Response:  %s", data);
  // Log to serial console
  Serial.println(output);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Functionality
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// This function is called when the Particle.function (A/C simulation) is called
int ledToggle(String command)
{
  if (command.equals("on"))
  {
    digitalWrite(LED_PIN, HIGH);
    return 1;
  }
  else if (command.equals("off"))
  {
    digitalWrite(LED_PIN, LOW);
    return 0;
  }
  else
  {
    // Unknown option
    return -1;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Particle Part
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// setup() runs once, when the device is first turned on.
void setup()
{
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Common Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Put initialization like pinMode and begin functions here.
  pinMode(LED_PIN, OUTPUT);    // Our LED pin is an output (turning on the LED)
  digitalWrite(LED_PIN, HIGH); //PWM could be used to simulate the speed of an A/C, On/OFF for now.
  RGB.control(true);
  RGB.color(255, 255, 255); // default color
  counter_serial = 0;
  counter_cloud = 0;
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Cloud Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  bPublish = false;
  rxCloudCmdStr = "";
  statusStr = "";
  ledHighLow = LOW;

  // Particle.variable() so that we can access the values of the photoresistors from the cloud
  Particle.variable("smart_light_analogvalue", smart_light_analogvalue);
  Particle.variable("door_analogvalue", door_analogvalue);

  // remote control
  Particle.function("cloudcmd", updateRxCmd);
  Particle.function("led", ledToggle); // turn the LED on/off (our A/C unit!) from cloud
  // Subscribe to the webhook response event
  Particle.subscribe("hook-response/smarthome", myWebhookHandler);

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Others
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Serial.begin();
}

// loop() runs over and over again, as quickly as it can execute.
void loop()
{
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Common part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  unsigned long t = millis();
  unsigned long period = millis() - t;

  //the value of the photoresistors and store them in the int variables
  //smart_light_analogvalue = analogRead(LIGHT_SENSOR);
  door_analogvalue = analogRead(DOOR_SENSOR);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (the DHT11 is a very slow sensor)
  // Read temperature as Celsius
  double c = dht.getTempCelcius();
  // Read temperature as Farenheit
  double f = dht.getTempFarenheit();

  Particle.variable("Temperature", f);
  // Read Humidity as %
  double h = dht.getHumidity();

  Particle.variable("Humidity", h);
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Serial Cmd Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  serialCmdProcessing();
  if (counter_serial % (SERAIL_COMM_FREQUENCY * LOOP_FREQUENCY) == 0)
  {
    counter_serial = 0;
    Serial.printf("{\"t\":%d,\"light\":%s,\"led\":%s,\"ct\":%ld,\"led_sensor\":%d,\"door_sensor\":%d,\"Humidity\":%d,\"Temperature\":%d,\"Temperature\":%d}",
                  (int)Time.now(), smartLight.getStatusStr().c_str(), toggleLed.getStatusStr().c_str(),
                  period, smartLight.getSensorVal(), door_analogvalue, h, c, f);
    Serial.println();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Cloud Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  cloudCmdProcessing();
  if (counter_cloud % (PUBLISH_FREQUENCY * LOOP_FREQUENCY) == 0)
  {
    counter_cloud = 0;
    statusStr = String::format("{\"t\":%d,\"light\":%s,\"led\":%s,\"ct\":%ld,\"led_sensor\":%d,\"door_sensor\":%d,\"Humidity\":%d,\"Temperature\":%d,\"Temperature\":%d}",
                               (int)Time.now(), smartLight.getStatusStr().c_str(), toggleLed.getStatusStr().c_str(),
                               period, smartLight.getSensorVal(), door_analogvalue, h, c, f);
    if (bPublish)
    {
      Particle.publish("smarthome", statusStr, PRIVATE);
      if (ledHighLow == LOW)
        ledHighLow = HIGH;
      else
        ledHighLow = LOW;
      digitalWrite(LED, ledHighLow);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Sensor Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  smartLight.execute();
  toggleLed.execute();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(c) || isnan(f))
  {
    Log.info("Failed to read from DHT sensor!");
  }
  else
  {
    // This prints the value to the USB debugging serial port (for optional
    // debugging purposes, newer and better than serial.print())
    Log.info("smartlightvalue = %d", smart_light_analogvalue);
    Log.info("doorvalue = %d", door_analogvalue);
    Log.info("Humidity = %.2f %%", h);
    Log.info("Temperature = %.2f *C", c);
    Log.info("Temperature = %.2f *F", f);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Counter Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  counter_serial++;
  counter_cloud++;
  period = PERIOD - (millis() - t);
  if (period > 0)
    delay(period);
}