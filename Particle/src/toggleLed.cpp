#include "toggleLed.h"

CToggleLed::CToggleLed() {
    state = S_OFF;
    hz = TOGGLE_FREQUENCY;
    period = TOGGLE_FREQUENCY * LOOP_FREQUENCY;
    tick = 0;
    statusStr = "{}";
}

void CToggleLed::cmdProcessing(JSONValue cmdJson) {
    JSONObjectIterator iter(cmdJson);
    while (iter.next()) {
        if (iter.name() == "frequency") {
            hz = (int)iter.value().toInt();
            period = (int)iter.value().toInt() * LOOP_FREQUENCY;
            tick = 0;
        }
    }
}

void CToggleLed::execute() {
    switch (state) {
        case CToggleLed::S_OFF:
            if (++tick >= period) {
                tick = 0;
                digitalWrite(LED, HIGH);
                state = CToggleLed::S_ON;
            }
            break;
        case CToggleLed::S_ON:
            if (++tick >= period) {
                tick = 0;
                digitalWrite(LED, LOW);
                state = CToggleLed::S_OFF;
            }
            break;
        default:
            break;
    }

    createStatusStr();
}

void CToggleLed::createStatusStr() {
    statusStr = String::format("{\"t\":%d,\"p\":%d,\"s\":%d,\"h\":%d}", tick, period, state, hz);
}