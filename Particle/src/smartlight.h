#ifndef _SMART_LIGHT_H_
#define _SMART_LIGHT_H_

#include "common.h"

typedef struct
{
    int On;         // false: off, true: on
    int Auto;       // false: manual, true: auto
    int Brightness; // 0 ~ 100
} SmartLightCmdStruct;

class CSmartLight
{
    enum STATE_L0
    {
        S_OFF,
        S_ON
    };
    enum STATE_L1
    {
        S_MANUAL,
        S_AUTO
    };
    enum STATE_L2
    {
        S_BED,
        S_NOBED
    };
    enum STATE_L3
    {
        S_WAKE,
        S_NOWAKE
    };


public:
    CSmartLight();

    void cmdProcessing(JSONValue cmdJson);

    void execute();

    int getSensorVal();
    void readSensorVal();
    String getStatusStr() { return statusStr; };

private:
    void resetCmd();
    void turnOffLight();
    void updateBrightnessManually(int val);
    void updataBrightnessAutomatically();
    void createStatusStr();

private:
    STATE_L0 state_L0;
    STATE_L1 state_L1;
    STATE_L2 state_L2;
    STATE_L3 state_L3;
    int brightness;
    int sensorVal;
    int sensorMax;
    int sensorMin;
    int r;
    int g;
    int b;
    SmartLightCmdStruct cmd;
    String statusStr;
};

#endif