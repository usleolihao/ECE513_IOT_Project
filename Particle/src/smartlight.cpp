#include "smartlight.h"

CSmartLight::CSmartLight() {
    state_L0 = CSmartLight::S_ON;
    state_L1 = CSmartLight::S_AUTO;
    brightness = RGB_BRIGHTNESS_DEAULT;
    sensorMax = LIGHT_SENSOR_MAX;
    sensorMin = LIGHT_SENSOR_MIN;

    statusStr = "{}";
    resetCmd();
}

void CSmartLight::cmdProcessing(JSONValue cmdJson) {
    JSONObjectIterator iter(cmdJson);
    while (iter.next()) {
        if (iter.name() == "on") {
            cmd.On = (int)iter.value().toBool();
        }
        else if (iter.name() == "auto") {
            cmd.Auto = (int)iter.value().toBool();
        }
        else if (iter.name() == "brightness") {
            cmd.Brightness = iter.value().toInt();
        }
        else if (iter.name() == "min") {
            sensorMin = iter.value().toInt();
        }
        else if (iter.name() == "max") {
            sensorMax = iter.value().toInt();
        }
    }
}

void CSmartLight::execute() {
    switch (state_L0) {
        case CSmartLight::S_OFF:
            turnOffLight();
            if (cmd.On != INVALID_CMD) {
                if (cmd.On) { 
                    state_L0 = CSmartLight::S_ON;
                    state_L1 = CSmartLight::S_MANUAL;
                }
            }  
            break;
        case CSmartLight::S_ON:
            switch (state_L1) {
                case CSmartLight::S_MANUAL:
                    updateBrightnessManually(cmd.Brightness);
                    if (cmd.Auto != INVALID_CMD) {
                        if (cmd.Auto) state_L1 = CSmartLight::S_AUTO;
                    }
                    break;
                
                case CSmartLight::S_AUTO:
                    updataBrightnessAutomatically();
                    if (cmd.Auto != INVALID_CMD) {
                        if (!cmd.Auto) state_L1 = CSmartLight::S_MANUAL;
                    }
                    break;
                
                default:
                    break;
            }

            if (cmd.On != INVALID_CMD) {
                if (!cmd.On) state_L0 = CSmartLight::S_OFF;
            }
            break;
            
        default:
            break;
    }
    resetCmd();
    createStatusStr();
}

void CSmartLight::resetCmd() {
    cmd.On = INVALID_CMD;
    cmd.Auto = INVALID_CMD;
    cmd.Brightness = INVALID_CMD;
}

void CSmartLight::turnOffLight() {
    if (RGB.brightness() != 0) RGB.brightness(0);
}

// 0 <= val <= 100 (i.e., %)
void CSmartLight::updateBrightnessManually(int val) {
    if (val == INVALID_CMD) {
        if (brightness != RGB.brightness()) RGB.brightness(brightness);
        return;
    }
    brightness = (int)((double)RGB_BRIGHTNESS_MAX*(double)val / 100.0);
    RGB.brightness(brightness);
}


void CSmartLight::updataBrightnessAutomatically() {
    readSensorVal();
    int curSensorVal = getSensorVal();
    if (curSensorVal < sensorMin) curSensorVal = sensorMin;
    if (curSensorVal > sensorMax) curSensorVal = sensorMax;
    double amountOfLight = (double)(curSensorVal-sensorMin) / (double)(sensorMax-sensorMin);

    brightness = (int)((double)RGB_BRIGHTNESS_MAX*(1.0-amountOfLight));
    RGB.brightness(brightness);
}


void CSmartLight::readSensorVal() {
    sensorVal = analogRead(LIGHT_SENSOR);
}

int CSmartLight::getSensorVal() {
    return sensorVal;
}


void CSmartLight::createStatusStr() {
    statusStr = String::format("{\"L0\":%d,\"L1\":%d,\"b\":%d,\"s\":%d,\"m\":%d,\"M\":%d}", 
        state_L0, state_L1, (int)((double)brightness/RGB_BRIGHTNESS_MAX*100.0), sensorVal, sensorMin, sensorMax);
}