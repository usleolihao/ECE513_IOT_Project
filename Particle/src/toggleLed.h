#ifndef _TOGGLELED_H_
#define _TOGGLELED_H_

#include "common.h"

class CToggleLed {
public:
    CToggleLed();
    void cmdProcessing(JSONValue cmdJson);
    void execute();
    String getStatusStr() {return statusStr;};
private:
    void createStatusStr();
private:
    enum STATE {S_OFF, S_ON};
    STATE state;

    int tick;
    int period;
    int hz;
    
    String statusStr;
};

#endif