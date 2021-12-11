#include "thermostat.h"
#include <iostream>
using namespace std;

Thermostat::Thermostat()
{
    minimumSetting = 15;
    maximumSetting = 30;
    hysteresis = 2;
}

Thermostat::Thermostat(int maxSetting, int minSetting)
{
    minimumSetting = minSetting;
    maximumSetting = maxSetting;
    hysteresis = 2;
}

Thermostat::Thermostat(int maxSetting, int minSetting, int hysteres)
{
    minimumSetting = minSetting;
    maximumSetting = maxSetting;
    hysteresis = hysteres;
}

string Thermostat::GetStateAfterReading(int reading, string initstate)
{

    if (reading >= maximumSetting)
        return "Cooling";

    else if (reading <= minimumSetting)
        return "Heating";

    else if (reading > (minimumSetting + hysteresis) && reading < (maximumSetting - hysteresis))
        return "Off";
    else
    {

        if (reading <= (minimumSetting + hysteresis) && initstate == "Heating")
            return "Heating";

        else if (reading >= (maximumSetting - hysteresis) && initstate == "Cooling")
            return "Cooling";

        else
            return "Off";
    }
}
