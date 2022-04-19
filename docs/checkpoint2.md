### ECE 513 Course project Check point 2

1. Implementations: three parts - particle firmware, localhost, and AWS.
	1. Particle firmware
		- Implement your firmware for the following things 
			- [x] Serial communication (i.e., localhost - device)
				- your commands and command processing
			- [x] Cloud communication (i.e., AWS - device)
				- your commands and command processing 
			- [x] Get temperature and humidity using DHT 11 
			- [x] Get values from two photoresistors
			- [x] Adjust smart light brightness (i.e., manual/auto mode)
			- [x] Estimate door status
	2. Local host (node.js + serialport + your web-based GUI)
		- Implement your web-based GUI and localhost server for the following things 
			- [x] Serial communication (connect/disconnect/device selection)
			- [x] Display your measurement data for
				- [x] Temperature/Humidity from DHT 11
				- [x] Values from two photoresistors
				- [x] Door status
				- [x] Smart light brightness
			- [x] Interface to adjust brightness of smart light (i.e., manual/auto mode)
	3. AWS
		- Client side web pages (do not need to support mobile devices for this checkpoint 2)
			- [x] Sign-up interface 
			- [x] Sign-in interface 
			- [x] Device registration interface
				- After “sign-in”, a user can register a particle device
				- Use case
					- [x] A user already has “device name”, “device ID”, and “access-token”.
					- [x] A user can register a device using the above information
					- [x] Your interface should provide an instruction (e.g., show information regarding event name, URL, Request type, Form fields in Advanced Settings) for the user to create the corresponding webhook 
			- [x] A visualization/control interface
				- [x]  A user can issue a “ping” command to check whether the registered device is online or offline
				- [x]  A user can issue a “publish” command to receive data (i.e., enable/disable “publish” mode)
				- [x]  A user can receive data from the device where the data should contain “time”, “temperature”, “humidity”, and “door status”
					- [x]  Minimum requirements: By clicking a button, a user can see received data 
			- [x] Server side 
				- [x] Implement your routers to communicate 1) between AWS and clients, and 2) between AWS and the registered device 
				- [x] Should use MongoDB for sign-up/sign-in/device registration 
				- [x] Should implement simulated clock
			- Should consider the following things 
				- [x] The device information should be managed by using your database 
				- [x] User information should be managed by using your database 
				- [x] You should use token-based authentication
2. Video demonstration
	- [x] Short video demo to show your implementation (10 minutes maximum)
	- [x] Should either be hosted on your server or hosted on some other publicly accessible service (e.g., YouTube)
	- [x] Show use cases regarding your web application (cloud communication) 
		- [x] sign-up/sing-in use cases 
		- [x] Device registration use cases 
		- [x] Particle cloud use cases (e.g., ping / receiving data)
	- [x] Show use cases regarding your local host application (e.g., serial communication) 
		- [x] Device connection (i.e., serial port open/close) 
		- [x] Display measurement data/brightness/door status 
		- [x] Control smart light
	- [x] Does not require fancy video editing. Also, does not need to include any verbal description (optional). Focus on showing the overall operations.
3. Documentation
	- [x]  Your state machines/state charts for the final implementation (PDF file)
		- [x]  i.e., should include all functionalities
	- [x]  README file
		- [x] Team information (name, email, project level) 
		- [x] AWS address (i.e., URL) 
		- [ ] Your video demo information (i.e., where to watch) 
		- [x] Your particle device information (i.e., what are you using for your project?) 
		- [x] Simple description of your implementation
			- [x]  Your methods, data sent, response codes, and response data formats (i.e., should provide enough information that on could use the endpoint without needing to refer to the code) 
		- [x] How to use your systems
4. Submission (Double check before submit)
	- [x] Please prepare the below folder structure for your submission
	- [x] Folder structure (where <span style="color: green;">green color</span> text represents a folder)
		- [x] <span style="color: green;">Particle</span>
			- [x] All your code for the particle firmware here
		- [x] <span style="color: green;">Localhost</span>
			- [x] All your code for the localhost
			- [x] _Should **not** include package-lock.json and node_modules_
		- [x] <span style="color: green;">AWS</span>
			- [x] All your code for your AWS
			- [x] _Should **not** include package-lock.json and node_modules_
		- [x] README.txt
		- [x] PDF file for your state machines/state charts
	- [x] Submit one single zip file to D2L
		- [x] File name: [Your team #]_[Your project level]_[LastName - at least one].zip
			- [x] For your team #, see Project teams
			- (example) 30_ECE513_Hong.zip
	- [x] Final project Checkpoint 2 submission (due 11/28, 11:59PM) in Assignments
5. Rubric
	- [x] State machine / state charts submission: 1 point (but no submission: -1 point)
	- [x] Video demo: 1 point (but no video demo: -1 point)
	- [x] Code submission: 1 point (but missing one of parts: -1 point)
	- [x] Particle device operations: 2 points 
		- [x] Localhost related operations: 1 points 
		- [x] AWS related operations: 1 points
	- [x] Localhost operations: 2 points 
		- [x] Display information: 1 points 
		- [x] Control: 1 points
	- [x]  AWS operations: 3 points 
		- [x] Client side: 1 point 
		- [x] Database: 1 point 
		- [x] Routers: 1 point
6. Others
	- If any requirement is not clear, you should post publicly on Q&A document to clarify the requirements. Any clarifications needed will be added to this document and marked as Clarification.
	- You are also responsible for monitoring the Q&A document for any project requirements and clarifications as well as Project description document.
	- Late submission means ZERO credits!!! NO exceptions! You can submit your file unlimitedly. So, you can upload partial outcomes to avoid any potential risks.