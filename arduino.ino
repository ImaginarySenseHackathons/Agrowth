#include <ArduinoJson.h>
const int MOISTURE_LEVEL = 800; // the value after the LED goes ON

String action;

int moisture;
int statuses[10] = {0};

void setup() {
    // when is on it's let you know that it don't have water
    Serial.begin(9600);
    while (!Serial){}
    Serial.println("start");
}
 
void loop() {
  if (Serial.available()) {
    //action = Serial.read() - '0';
    action = Serial.readStringUntil('\n');
    if (action.charAt(0) == '1') {
      if (action.length() == 3) {
        int sensorIndex = action.charAt(1) - '0';
        if (sensorIndex >= 0  && sensorIndex < 10) {
          int sensorStatus = action.charAt(2) - '0';
          statuses[sensorIndex] = sensorStatus;
        }
        Serial.println("changed");
      }
    } else if (action.charAt(0) == '2') {
      String jsonStr;
      const size_t CAPACITY = JSON_ARRAY_SIZE(50);
      StaticJsonDocument<CAPACITY> doc;
      JsonArray array = doc.to<JsonArray>();

      JsonObject object;
      JsonObject sensor;
      for (int i = 0; i < 10; i++) {
        object = array.createNestedObject();
        sensor = object.createNestedObject("sensor");
        sensor["index"] = i;
        if (statuses[i] == 1) {
          sensor["value"] = analogRead(i);
        }
        
      }

      serializeJson(doc, jsonStr);
      Serial.println(jsonStr);
      //Serial.println("continue");
    } else if (action.charAt(0) == '3') {
      action.remove(0, 1);
      analogWrite(15, action.toFloat());
      Serial.println("value sended");
    }
    action = "0";
  }
}
