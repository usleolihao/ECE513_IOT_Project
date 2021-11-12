/*
 * Project: ParticleCloudExample
 * Description: This is a simple example how to use particle cloud
 * Author: Minsik Hong
 * Date: 11/8/2021
 */

#define PERIOD     100
#define LOOP_FREQUENCY   (1000/PERIOD)   // Loop frequency
#define PUBLISH_FREQUENCY 1             // 1 Hz
#define LED         D7

// global variables
int counter;
bool bPublish;      // enable/disable publish
String rxCloudCmdStr; // receive command via internet
String statusStr;
uint8_t ledHighLow;

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

// setup() runs once, when the device is first turned on.
void setup() {
  // Put initialization like pinMode and begin functions here.
  pinMode(LED, OUTPUT);
  counter = 0;
  bPublish = false;
  rxCloudCmdStr = "";
  statusStr = "";
  ledHighLow = LOW;
  Serial.begin();

  // remote control
  Particle.function("cloudcmd", updateRxCmd);
  // Subscribe to the webhook response event
  Particle.subscribe("hook-response/smarthome", myWebhookHandler);
}

// loop() runs over and over again, as quickly as it can execute.
void loop() {
  unsigned long t = millis();
  cloudCmdProcessing();
  if (counter % (PUBLISH_FREQUENCY * LOOP_FREQUENCY) == 0) {
    counter = 0;
    statusStr = String::format("{\"t\":%d}", (int)Time.now());
    if (bPublish) {
      Particle.publish("smarthome", statusStr, PRIVATE);
      if (ledHighLow == LOW) ledHighLow = HIGH;
      else ledHighLow = LOW; 
      digitalWrite(LED, ledHighLow);
    }
  }
  counter++;
  unsigned long period = PERIOD - (millis() - t);
  if (period > 0) delay(period);  
}

// When obtain response from the publish
void myWebhookHandler(const char *event, const char *data) {
  // Formatting output
  String output = String::format("Response:  %s", data);
  // Log to serial console
  Serial.println(output);
}