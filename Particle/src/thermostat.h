#include<string>

class Thermostat
{

public:
int minimumSetting;

int maximumSetting;

int hysteresis;

Thermostat();

Thermostat(int, int);

Thermostat(int, int, int);
public:

std::string GetStateAfterReading(int, std::string);
};