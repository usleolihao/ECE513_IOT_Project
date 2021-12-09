### v2.0.0 12/08/2021

- Particle
	- add variables of ac/door/power
	- if failed to read DHT, set value to 0
	- initialize all variables
- DASHBOARD 2.0.0
	- Read Temperature status
	- Read Humidity status
	- Read Door status
	- Thermostat widget
		- ac mode interface
		- (auto mode)/off, off/Cool/Heat
	- Smartlight widget
		- smartlight animation
		- write on/off smart light
	- Power consumption widget
	- AC/Heat widget
	- Temp/Hum History widget


### v1.11 12/07/2021

- Removed local serial from AWS
- Updated README
- DASHBOARD 2.0.0
	- hidden Smart Light
	- hidden CMD Status Data Output
	- hidden Oline Communication
	- changed to information part to modules
	- changed to dynamic creation of widget
		- weather_module();
    	- temperature_module()
    		- get result from third party API
    		- updates Highest/Lowest/Current Temperature
    		- updates Weather Icon
    		- updates Humidity
    		- updates City and Zip
    	- humidity_module()
    	- doorstatus_module()
-  Server site
	- add get method for third party weather API

### v1.10 11/28/2021

- Updated instruction of Webhook
- Removed local serial from Dashboard
- Added reading single variable for humidity, temperature, sensors
- Added remoting control of smart light and sensor value
- update Localhost for local serial communication
- update Readme.md
- fixed bugs

### v1.09 11/27/2021

3. AWS
	- Client side web pages (do not need to support mobile devices for this checkpoint 2)
		- [x] Your interface should provide an instruction (e.g., show information regarding event name, URL, Request type, Form fields in Advanced Settings) for the user to create the corresponding webhook 
		- [x] Door Sensor Status
		- [x] Humidity Status
		- [x] Temperature Status

### v1.08 11/26/2021

1. Particle firmware
	- Implement your firmware for the following things 
		- [x] Get temperature and humidity using DHT 11 
		- [x] Get values from two photoresistors
		- [x] Estimate door status
		- [x]  A user can receive data from the device where the data should contain “time”, “temperature”, “humidity”, and “door status”
				- [x]  Minimum requirements: By clicking a button, a user can see received data 
2. Local host (node.js + serialport + your web-based GUI)
	- Implement your web-based GUI and localhost server for the following things 
		- [x] Display your measurement data for
			- [x] Temperature/Humidity from DHT 11
			- [x] Values from two photoresistors
			- [x] Door status
			- [x] Smart light brightness
3. AWS
	- Client side web pages (do not need to support mobile devices for this checkpoint 2)
		- [x] A visualization/control interface
			- [x]  A user can receive data from the device where the data should contain “time”, “temperature”, “humidity”, and “door status”
		- [x] Server side 
			- [x] implement simulated clock for local serial


### v1.07 11/25/2021

1. Particle firmware
	- Implement your firmware for the following things 
		- [x] Serial communication (i.e., localhost - device)
			- your commands and command processing
		- [x] Cloud communication (i.e., AWS - device)
			- your commands and command processing 
		- [x] Adjust smart light brightness (i.e., manual/auto mode)
2. Local host (node.js + serialport + your web-based GUI)
	- Implement your web-based GUI and localhost server for the following things 
		- [x] Serial communication (connect/disconnect/device selection)
		- [x] Interface to adjust brightness of smart light (i.e., manual/auto mode)
3. AWS
	- Client side web pages (do not need to support mobile devices for this checkpoint 2)
			- [x]  A user can issue a “ping” command to check whether the registered device is online or offline
			- [x]  A user can issue a “publish” command to receive data (i.e., enable/disable “publish” mode)
			
		-  Server side 
			- [x] Should implement simulated clock for Online publish



### v1.06 11/24/2021

- Account Creation and Management
	- account.html/js
		- [x] A user should be able to update any of their account information, except email
			- [x] register at least one device with their account
			- [x] list registered devices
		- [x] Device registration interface
			- [x] A user should be able to add and 
			- [x] remove devices (e.g., device ID and API key) in his/her account
			- [x] remove device from the list
			- [x] A user should be able to have more than one device
	- [x] Server site: Implement routers to communicate 
		- [x] device/add
		- [x] device/delete

### v1.05 11/23/2021

- Account Creation and Management
	- account.html/js
		- A user should be able to update any of their account information, except email
			- [x] update information
			- [x] delete account
			- [x] User are able to change Preference panel after Login
			- [x] clear Localstorage after register account
	- Server site: Implement routers to communicate 
		- [x] user/update
		- [x] user/delete

### v1.04 11/22/2021

- Account Creation and Management
	- [x] Access to the web application should be controlled using token based authentication
	- [x] User create an account by using an email as the username and a strong password
	- Client site
		- [x] Sign-up interface 
			- signup.js
		- [x] Sign-in interface
			- login.js
		- account.html/js
			- [x] review information
			- A user should be able to update any of their account information, except email
				- [x] A user should be able to add their location using a zip code
	- Between AWS and clients 
		- [x] use MongoDB for sign-up/sign-in/device registration 
	- Server site: Implement routers to communicate 
		- [x] user/signup
		- [x] user/login
		- user/update
			- [x] updatezip
- Removed unnecessary files

### v1.03 11/21/2021

- Signup
	- sign.css
	- signup.html
	- signup.js
- Login.html
	- init login.js

### v1.02 11/20/2021

- GitHub Pages
	- removed unnecessary files
- Static index.html
	- responsive design
		- carousel image width
	- separate navigation
	- separate carousel
- Dynamic website
	- changed engine of template from `pug` to `swig` 
	- converted `index.html` to different parts
	- extracted website frame to templates for all pages
- Implementation of Https
	- certificated 90-day SSL, expires on Feb 19,2022
- Initial Signup page 

### v1.01 11/11/2021

- GitHub Pages with template
	- Changed `default.html`
	- index.md
	- updates.md
	- Check point 2
- Re-structure the project directories
	- AWS (Home page)
	- Localhost (Node.js + Serialport + Web-based GUI)
	- Particle (Particle firmware)
- README.md
- README.txt for submission

