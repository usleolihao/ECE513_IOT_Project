## Welcome to Smart Home Application 

The innovative home application is a low-cost IoT-enabled web application for:
1. Monitoring temperature and humidity.
2. Controlling a thermostat and a lighting system.
3. Simulating power consumption, a simple security system, and others.

## Quick link

- [Project Home Portal 1](http://ec2-54-151-67-43.us-west-1.compute.amazonaws.com:3000/)
- [Check point 2](checkpoint2.md)
- [Updates History](update.md)

## Todo List

- Account Creation and Management
- [ ] Sign-up interface 
- [ ] Sign-in interface 
	- [ ] A user must be able to create an account, using an email address as the username and a strong password, and register at least one device with their account
	- [ ] A user should be able to update any of their account information, except their email
	- [ ] A user should be able to add and remove devices (e.g., device ID and API key) in his/her account
	- [ ] A user should be able to have more than one device
	- [ ] A user should be able to add their location using a zip code
	- [ ] Access to the web application should be controlled using token based authentication
- [ ] Device registration interface
- [ ] Implement your routers to communicate 
	1. between AWS and clients, and 
		- [ ] use MongoDB for sign-up/sign-in/device registration 
	2. between AWS and the registered device 
		- [ ] Should implement simulated clock



## Updates

{% include_relative update.md max-height="200vh" %}

## Overview

- The IoT device uses two photoresistors and a humidity & temperature sensor (DHT11)
- The IoT device will transmit measurements to a web application so that users can monitor their homes. It will use a simulated clock for this project.
- The web application uses responsive design to allow users to view the application seamlessly on desktop, tablet, and mobile devices.
- The web application should have a navigation menu.
- The web application should use a responsive design to be viewable on desktops, tablets, and smartphones. The web application should have the index.html page to introduce your team and your project.
- The web application should have the `reference.html` page to list your third-party APIS, libraries, and code.

