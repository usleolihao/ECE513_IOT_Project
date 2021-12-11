/*
 * ECE 513 Final Project Samrt Home
 * Description:
 * Smart light / Sensor DHT11 / Publish / Reading value
 * Author: Lihao Guo, Nasser Salem Albalawi
 * Date: 11/26/2021
 */

// Please configure your project
// From the Command Palette
//   1. select Particle: Configure Project for Device
//   2. the device OS version you'd like to build for: (use 2.2.0)
//   3. the type of device to you'd like to build for (i.e., select your device - Argon or Photon)
//   4. the name or device ID of the device you want to flash to. Just leave this blank

#include "common.h"
#include "smartlight.h"
#include "toggleLed.h"
#include "Adafruit_DHT_Particle.h"

// The following line is optional, but recommended in most firmware.
// It allows your code to run before the cloud is connected.
SYSTEM_THREAD(ENABLED);

// This uses the USB serial port for debugging logs.
SerialLogHandler logHandler;

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global variables
/////////////////////////////////////////////////////////////////////////////////////////////////////////
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
double cel;
double far;
double hum;

// Counter
int counter_serial;
int counter_cloud;

// Variables for Particle Cloud
bool bPublish;        // enable/disable publish
String rxCloudCmdStr; // receive command via internet
String statusStr;
uint8_t ledHighLow;

// Variables for Thermostat/Power consumption/door status
int acmode;         // 0: OFF, 1:Cool, 2: Heat, 3:Auto
int actemp;         // desired temperature
bool doorstatus;    // true for open, false for close
long door_opentime; // calculated door open time if longer than 10 mins warning
long door_opentime2; 
double power_consumption;
long acstarttime;
long actime;

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Thermostat and Power consumpution
/////////////////////////////////////////////////////////////////////////////////////////////////////////
void thermostat(){
    long diff_time = 0;
    // if mode == 0 that's off do nothing
    //if mode == 1 cooling mode == 2 heating 
    if (acmode ==1 || acmode == 2){
      //cooling and heating
      //calucate time
       diff_time = (int)Time.now() -  acstarttime;
    }
    // if mode == 3 auto
    if (acmode ==3){
        //auto if  far(this is current degree in Farh ) > than dtemp
        if (far > actemp){
        //  make it cool
          diff_time = (int)Time.now() -  acstarttime;
        }
        // else lower heat
        else if ( far < actemp){
          diff_time = (int)Time.now() -  acstarttime;
        }
    }

    actime += diff_time;
}
// Power consumption 
double powerused(){
  //formala
  double electricEnergy = (actime / 1000 / 3600) * 1000;
  //return final power used
  if (actime !=0){
    if (acmode ==1){
      return electricEnergy ;
    }
    else if (acmode ==2){
      return electricEnergy ;
    }
    else if (acmode ==3){
      return electricEnergy ;
    }

  }
}

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
    else if (iter.name() == "acmode")
    {
      acmode = iter.value().toInt();
      if (acmode != 0){
        acstarttime = (int)Time.now();
      }
    }
    else if (iter.name() == "temp")
    {
      actemp = iter.value().toInt();
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cloud Cmd Processing
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// function to receive command via internet
int updateRxCmd(String cmdStr)
{
  // Serial.println(cmdStr.c_str());
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
    else if (iter.name() == "smartlight")
    {
      smartLight.cmdProcessing(iter.value());
    }
    else if (iter.name() == "led")
    {
      toggleLed.cmdProcessing(iter.value());
    }
    else if (iter.name() == "acmode")
    {
      acmode = iter.value().toInt();
    }
    else if (iter.name() == "temp")
    {
      actemp = iter.value().toInt();
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
// Particle Part
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// setup() runs once, when the device is first turned on.
void setup()
{
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Common Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Put initialization like pinMode and begin functions here.
  pinMode(LED, OUTPUT);
  RGB.control(true);
  RGB.color(255, 255, 255); // default color
  counter_serial = 0;
  counter_cloud = 0;
  cel = 0;
  far = 0;
  hum = 0;
  // 0: OFF, 1:Cool, 2: Heat, 3:Auto
  acmode = 0;
  // desired temperature
  actemp = 0;
  // true for open, false for close
  doorstatus = false;
  // calculated door open time if longer than 10 mins warning
  door_opentime = 0;
  door_opentime2 = 0;
  power_consumption = 0;
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
  Particle.variable("Temperature_Celcius", cel);
  Particle.variable("Temperature_Farenheit", far);
  Particle.variable("Humidity", hum);
  Particle.variable("acmode", acmode);
  Particle.variable("actemp", actemp);
  Particle.variable("doorstatus", doorstatus);
  Particle.variable("doorduration", door_opentime);
  Particle.variable("power", power_consumption);
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
void loop()
{
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Common part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  unsigned long t = millis();
  unsigned long period = millis() - t;

  // the value of the photoresistors and store them in the int variables
  smart_light_analogvalue = analogRead(LIGHT_SENSOR);
  door_analogvalue = analogRead(DOOR_SENSOR);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (the DHT11 is a very slow sensor)
  // Read temperature as Celsius
  cel = dht.getTempCelcius();
  // Read temperature as Farenheit
  far = dht.getTempFarenheit();
  // Read Humidity as %
  hum = dht.getHumidity();

  if (isnan(hum))
  {
    // Log.info("{\"msg\":Failed to read humidity from DHT sensor!}");
    hum = 0;
  }
  else if (isnan(cel))
  {
    // Log.info("{\"msg\":Failed to read celcius from DHT sensor!}");
    cel = 0;
  }
  else if (isnan(far))
  {
    // Log.info("{\"msg\":Failed to read farenheit from DHT sensor!}");
    far = 0;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Door status
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (door_analogvalue < 100)
  {
    doorstatus = false;
    door_opentime2 = 0;
  }
  else
  {
    doorstatus = true;
    door_opentime2 = (int)Time.now();
  }

  // if door is open, count ms
  if (doorstatus)
  {
    door_opentime = ((int)Time.now() - door_opentime2)/1000; //ms to s
  }
  else
  {
    door_opentime = 0; // reset open time if closed
  }

  thermostat();
  power_consumption = powerused();
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Serial Cmd Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  serialCmdProcessing();
  if (counter_serial % (SERAIL_COMM_FREQUENCY * LOOP_FREQUENCY) == 0)
  {
    counter_serial = 0;
    Serial.printf("{\"t\":%d,\"light\":%s,\"led\":%s,\"ct\":%ld,\"led_sensor\":%d,\"door_sensor\":%d,\"Humidity\":%.2f,\"TemperatureC\":%.2f,\"TemperatureF\":%.2f,\"acmode\":%d,\"actemp\":%d,\"doorstatus\":%s,\"door_opentime\":%ld,\"power_consumption\":%.2lf}",
                  (int)Time.now(), smartLight.getStatusStr().c_str(), toggleLed.getStatusStr().c_str(),
                  period, smart_light_analogvalue, door_analogvalue, hum, cel, far, acmode, actemp, doorstatus ? "\"Open\"" : "\"Close\"", door_opentime, power_consumption);
    Serial.println();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Cloud Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  cloudCmdProcessing();
  if (counter_cloud % (PUBLISH_FREQUENCY * LOOP_FREQUENCY) == 0)
  {
    counter_cloud = 0;
    statusStr = String::format("{\"t\":%d,\"light\":%s,\"led\":%s,\"ct\":%ld,\"led_sensor\":%d,\"door_sensor\":%d,\"Humidity\":%.2f,\"TemperatureC\":%.2f,\"TemperatureF\":%.2f,\"acmode\":%d,\"actemp\":%d,\"doorstatus\":%s,\"door_opentime\":%ld,\"power_consumption\":%.2lf}",
                               (int)Time.now(), smartLight.getStatusStr().c_str(), toggleLed.getStatusStr().c_str(),
                               period, smart_light_analogvalue, door_analogvalue, hum, cel, far, acmode, actemp, doorstatus ? "\"Open\"" : "\"Close\"", door_opentime, power_consumption);
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Counter Part
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  counter_serial++;
  counter_cloud++;
  period = PERIOD - (millis() - t);
  if (period > 0)
    delay(period);
}