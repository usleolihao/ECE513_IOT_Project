### v1.07 11/25/2021

1. Particle firmware
	- Implement your firmware for the following things 
		- [ ] Serial communication (i.e., localhost - device)
			- your commands and command processing
		- [ ] Cloud communication (i.e., AWS - device)
			- your commands and command processing 
		- [ ] Get temperature and humidity using DHT 11 
		- [ ] Get values from two photoresistors
		- [x] Adjust smart light brightness (i.e., manual/auto mode)
		- [ ] Estimate door status
2. Local host (node.js + serialport + your web-based GUI)
	- Implement your web-based GUI and localhost server for the following things 
		- [x] Serial communication (connect/disconnect/device selection)
		- [ ] Display your measurement data for
			- [ ] Temperature/Humidity from DHT 11
			- [ ] Values from two photoresistors
			- [ ] Door status
			- [ ] Smart light brightness
		- [x] Interface to adjust brightness of smart light (i.e., manual/auto mode)
3. AWS
	- Client side web pages (do not need to support mobile devices for this checkpoint 2)
		- [ ] Your interface should provide an instruction (e.g., show information regarding event name, URL, Request type, Form fields in Advanced Settings) for the user to create the corresponding webhook 
		- [ ] A visualization/control interface
			- [x]  A user can issue a “ping” command to check whether the registered device is online or offline
			- [ ]  A user can issue a “publish” command to receive data (i.e., enable/disable “publish” mode)
			- [ ]  A user can receive data from the device where the data should contain “time”, “temperature”, “humidity”, and “door status”
				- [x]  Minimum requirements: By clicking a button, a user can see received data 
		- [ ] Server side 
			- [ ] Should implement simulated clock



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

