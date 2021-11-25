### ECE 513 Course project Check point 2

1. Implementations: three parts - particle firmware, localhost, and AWS.
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
			- [x] Sign-up interface 
			- [x] Sign-in interface 
			- [x] Device registration interface
				- After “sign-in”, a user can register a particle device
				- Use case
					- [x] A user already has “device name”, “device ID”, and “access-token”.
					- [x] A user can register a device using the above information
					- [ ] Your interface should provide an instruction (e.g., show information regarding event name, URL, Request type, Form fields in Advanced Settings) for the user to create the corresponding webhook 
			- [ ] A visualization/control interface
				- [ ]  A user can issue a “ping” command to check whether the registered device is online or offline
				- [ ]  A user can issue a “publish” command to receive data (i.e., enable/disable “publish” mode)
				- [ ]  A user can receive data from the device where the data should contain “time”, “temperature”, “humidity”, and “door status”
					- [ ]  Minimum requirements: By clicking a button, a user can see received data 
			- [ ] Server side 
				- [ ] Implement your routers to communicate 1) between AWS and clients, and 2) between AWS and the registered device 
				- [x] Should use MongoDB for sign-up/sign-in/device registration 
				- [x] Should implement simulated clock
			- Should consider the following things 
				- [x] The device information should be managed by using your database 
				- [x] User information should be managed by using your database 
				- [x] You should use token-based authentication
2. Video demonstration
	- [ ] Short video demo to show your implementation (10 minutes maximum)
	- [ ] Should either be hosted on your server or hosted on some other publicly accessible service (e.g., YouTube)
	- [ ] Show use cases regarding your web application (cloud communication) 
		- [ ] sign-up/sing-in use cases 
		- [ ] Device registration use cases 
		- [ ] Particle cloud use cases (e.g., ping / receiving data)
	- [ ] Show use cases regarding your local host application (e.g., serial communication) 
		- [ ] Device connection (i.e., serial port open/close) 
		- [ ] Display measurement data/brightness/door status 
		- [ ] Control smart light
	- [ ] Does not require fancy video editing. Also, does not need to include any verbal description (optional). Focus on showing the overall operations.
3. Documentation
	- [ ]  Your state machines/state charts for the final implementation (PDF file)
		- [ ]  i.e., should include all functionalities
	- [ ]  README file
		- [x] Team information (name, email, project level) 
		- [x] AWS address (i.e., URL) 
		- [ ] Your video demo information (i.e., where to watch) 
		- [ ] Your particle device information (i.e., what are you using for your project?) 
		- [ ] Simple description of your implementation
			- [ ]  Your methods, data sent, response codes, and response data formats (i.e., should provide enough information that on could use the endpoint without needing to refer to the code) 
		- [ ] How to use your systems
4. Submission (Double check before submit)
	- [ ] Please prepare the below folder structure for your submission
	- [ ] Folder structure (where <span style="color: green;">green color</span> text represents a folder)
		- [x] <span style="color: green;">Particle</span>
			- [ ] All your code for the particle firmware here
		- [x] <span style="color: green;">Localhost</span>
			- [ ] All your code for the localhost
			- [ ] __Should **not** include package-lock.json and node_modules__ 
		- [x] <span style="color: green;">AWS</span>
			- [ ] All your code for your AWS
			- [ ] __Should **not** include package-lock.json and node_modules__
		- [ ] README.txt
		- [ ] PDF file for your state machines/state charts
	- [ ] Submit one single zip file to D2L
		- [ ] File name: [Your team #]_[Your project level]_[LastName - at least one].zip
			- [ ] For your team #, see Project teams
			- (example) 30_ECE513_Hong.zip
	- [ ] Final project Checkpoint 2 submission (due 11/23, 11:59PM) in Assignments
5. Rubric
	- [ ] State machine / state charts submission: 1 point (but no submission: -1 point)
	- [ ] Video demo: 1 point (but no video demo: -1 point)
	- [ ] Code submission: 1 point (but missing one of parts: -1 point)
	- [ ] Particle device operations: 2 points 
		- [ ] Localhost related operations: 1 points 
		- [ ] AWS related operations: 1 points
	- [ ] Localhost operations: 2 points 
		- [ ] Display information: 1 points 
		- [ ] Control: 1 points
	- [ ]  AWS operations: 3 points 
		- [ ] Client side: 1 point 
		- [ ] Database: 1 point 
		- [ ] Routers: 1 point
6. Others
	- If any requirement is not clear, you should post publicly on Q&A document to clarify the requirements. Any clarifications needed will be added to this document and marked as Clarification.
	- You are also responsible for monitoring the Q&A document for any project requirements and clarifications as well as Project description document.
	- Late submission means ZERO credits!!! NO exceptions! You can submit your file unlimitedly. So, you can upload partial outcomes to avoid any potential risks.