## Welcome to Smart Home Application 

The innovative home application is a low-cost IoT-enabled web application for:
1. Monitoring temperature and humidity.
2. Controlling a thermostat and a lighting system.
3. Simulating power consumption, a simple security system, and others.

## Quick link

- [Project Home Portal 1](https://ec2-54-151-67-43.us-west-1.compute.amazonaws.com/)
- [Check point 2](checkpoint2.md)
- [Updates History](update.md)

## Todo List

1. Particle firmware
	- Implement your firmware for the following things 
		- [ ] Serial communication (i.e., localhost - device)
			- your commands and command processing
		- [ ] Cloud communication (i.e., AWS - device)
			- your commands and command processing 
		- [ ] Get temperature and humidity using DHT 11 
		- [ ] Get values from two photoresistors
		- [ ] Adjust smart light brightness (i.e., manual/auto mode)
		- [ ] Estimate door status
2. Local host (node.js + serialport + your web-based GUI)
	- Implement your web-based GUI and localhost server for the following things 
		- [ ] Serial communication (connect/disconnect/device selection)
		- [ ] Display your measurement data for
			- [ ] Temperature/Humidity from DHT 11
			- [ ] Values from two photoresistors
			- [ ] Door status
			- [ ] Smart light brightness
		- [ ] Interface to adjust brightness of smart light (i.e., manual/auto mode)
3. AWS
	- Client side web pages (do not need to support mobile devices for this checkpoint 2)
		- [ ] Device registration interface
			- After “sign-in”, a user can register a particle device
			- Use case
				- [ ] Your interface should provide an instruction (e.g., show information regarding event name, URL, Request type, Form fields in Advanced Settings) for the user to create the corresponding webhook 
		- [ ] A visualization/control interface
			- [ ]  A user can issue a “ping” command to check whether the registered device is online or offline
			- [ ]  A user can issue a “publish” command to receive data (i.e., enable/disable “publish” mode)
			- [ ]  A user can receive data from the device where the data should contain “time”, “temperature”, “humidity”, and “door status”
				- [ ]  Minimum requirements: By clicking a button, a user can see received data 
		- [ ] Server side 
			- [ ] Implement your routers to communicate 1) between AWS and clients, and 2) between AWS and the registered device 
			- [ ] Should implement simulated clock

## Overview

- The IoT device uses two photoresistors and a humidity & temperature sensor (DHT11)
- The IoT device will transmit measurements to a web application so that users can monitor their homes. It will use a simulated clock for this project.
- The web application uses responsive design to allow users to view the application seamlessly on desktop, tablet, and mobile devices.
- The web application should have a navigation menu.
- The web application should use a responsive design to be viewable on desktops, tablets, and smartphones. The web application should have the index.html page to introduce your team and your project.
- The web application should have the `reference.html` page to list your third-party APIS, libraries, and code.

## Updates

{% include_relative update.md max-height="300pt" %}



