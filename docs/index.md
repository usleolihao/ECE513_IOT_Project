## Welcome to Smart Home Application 

The innovative home application is a low-cost IoT-enabled web application for:
1. Monitoring temperature and humidity.
2. Controlling a thermostat and a lighting system.
3. Simulating power consumption, a simple security system, and others.

## Quick link

- [Project Home Portal](https://ec2-54-151-67-43.us-west-1.compute.amazonaws.com/)
- [Updates History](update.md)
- [Final checkpoint](checkpoint3.md)
- [link of final video](#)
- [<strike>link of video demo 1</strike>](https://drive.google.com/file/d/1o_tCyV5lNdAILVl7f4SEeocQd3oz1y8E/view?usp=sharing)
- [<strike>Checkpoint 2</strike>](checkpoint2.md)

## Todo List

Total points: 7.5 points
- [ ] Video demo submission 0.5 
	- [ ] shows AWS running
	- [ ] shows Localhost running
	- [ ] shows particle running
	- [ ] shows sign in/Sign up
	- [ ] shows device registration
	- [ ] shows responsive pages
	- [ ] shows simulated clock
	- [ ] shows weather information display
	- [ ] shows thermostat operation
	- [ ] shows wifi temperature & humidity sensor operation
	- [ ] shows smart bulb operation
	- [ ] shows door status simulation
	- [ ] shows temperature & humidity monitoring
	- [ ] shows power consumption simulation
	- [ ] shows HTTPS
- [ ] Code submission 0.5
- [x] README file 0.5
- [ ] AWS running 1
- [ ] Localhost running 1
- [ ] Particle running 1
- [x] Sign in/Sign up 0.5
	- [x] Provide test account
		- email: test@gmail.com
		- pw: "mcGC6!q
- [x] Device registration 1
- [x] Responsive pages 1
- [x] Simulated clock 1
- [x] Weather infomration display 1
- [ ] Thermostat operation 2
	- [ ] Should support on (auto mode)/off, off/Cool/Heat, and
	- [ ] temperature setting with hysteresis for your auto mode
	- [ ] Based on temperature captured by DHT 11, thermostat should run or stop your A/C or heater.
	- [ ] for both localhost and web app
- [ ] WIFI Temperature & Humidity Sensor operation 2
	- [ ] Should start/stop collecting data using your web app
	- [ ] Should store your measurement data on your database
	- [ ] Minimum requirement: collect data every 10 minutes (simulated clock) 
	- [x] (i.e., 1 sec in device = 1 minutes in AWS) (1 sec = 10 minutes is too fast)
- [ ] Smart bulb operation 2
	- [ ] Should control your bulb for on/off, manual/auto, color using localhost app
	- [ ] Should control your bulb For on/off, manual/auto, color, bedtime, wake-up using web app
- [ ] Door status simulation 1
	- [ ] Should display the door status on localhost app and web app Should display any kind of alerts when the door state is "open" for a while 
	- [ ] (e.g., when a user click a button to check whether the door alert is generated or not, your app should display the corresponding information)
- [ ] Temperature & humidity monitoring 2
	- [ ] Should display 24 hours history and daily history 24 hours history and daily history (at least 7days)
- [ ] Power consumption simulation 2
	- [ ] Should display daily usage and weekly usage
	- [ ] Should include your power consumption related code in your particle firmware
	- [ ] (e.g., use power state machine for your thermostat with a/c and heater)
	- [ ] test account to see daily usage and weekly usage
- [x] HTTPS 2.5
- [ ] Submission due 12/12 23:59



## Overview

- The IoT device uses two photoresistors and a humidity & temperature sensor (DHT11)
- The IoT device will transmit measurements to a web application so that users can monitor their homes. It will use a simulated clock for this project.
- The web application uses responsive design to allow users to view the application seamlessly on desktop, tablet, and mobile devices.
- The web application should have a navigation menu.
- The web application should use a responsive design to be viewable on desktops, tablets, and smartphones. The web application should have the index.html page to introduce your team and your project.
- The web application should have the `reference.html` page to list your third-party APIS, libraries, and code.

## Updates

{% include_relative update.md max-height="300pt" %}



