# SMART HOME Project

This repertory contains files of `SMART HOME Project`.

## ABOUT

### Team information

- Team Member: Lihao Guo
    - email: leolihao@email.arizona.edu
- Team Member: Jaewan Kim
    - email: kimj2@email.arizona.edu
- Team Member: Nasser Salem Albalawi
    - email: nasseralbalawi@email.arizona.edu
- Project level: ECE513

### AWS address

- [http - Port 80](http://ec2-54-151-67-43.us-west-1.compute.amazonaws.com/)
- [https - Port 443](https://ec2-54-151-67-43.us-west-1.compute.amazonaws.com/)

### Video demo information

[link of video demo](#)

### Particle Device Information

Device Type: Photon

## Description of Our Project

The intelligent home application web page for a project monitors the temperature, humidity, and door open/close, controls a thermostat and a lighting system, and simulates power consumption using IoT sensors (such as a photon, photoresistor, and DH11). It is also a web application for the project to understand the basic architecture of smart homes and data process flow between each configuration.

### Methods

#### Website redirect

| Endpoint    | Description                   |
|:------------|:------------------------------|
| signup      | Signup page                   |
| login       | Login page                    |
| account     | account page                  |
| dashboard   | dashboard                     |
| edit        | edit account information page |
| devices     | devices page                  |
| instruction | instruction for Webhook       |


#### Account

| Endpoint              | Description                                                                                         |
|:----------------------|:----------------------------------------------------------------------------------------------------|
| user/signup           | Handle process of signup return 401 for unauthorized 201 for Created                                |
| user/lgoin            | Handle process Login of return 400 for bad request, 401 for unauthorized 201 return 200 for success |
| user/account          | Handle process of loading account information return 200 for success                                |
| user/updatezip        | It will update the zip code of user return 200 for succes                                           |
| user/updatepreference | Handle process of updating account preference panel after login, return 200 for success             |
| user/updateall        | Handle process of updating account information return 200 for success                               |
| user/deleteaccount    | Deleting Account return 201 for success                                                             |

#### Device

| Endpoint        | Description                                                                       |
|:----------------|:----------------------------------------------------------------------------------|
| device/register | Handle process of registering device, return 401 for unauthorized 201 for created |
| device/remove   | Handle process of registering device, return 401 for unauthorized 201 for removed |
| device/list     | Return registed device stored in database                                         |

#### Cloud

| Endpoint      | Description                                                                    |
|:--------------|:-------------------------------------------------------------------------------|
| cloud/ping    | Ping the device if device is Online otherwise return 201 with false of success |
| cloud/read    | Read value from device                                                         |
| cloud/report  | Device sends value to server when device published                             |
| cloud/publish | Send a request to publish device                                               |


#### Local Serial

| Endpoint         | Description                                    |
|:-----------------|:-----------------------------------------------|
| serial/scan      | Scan the device in ports                       |
| serial/open      | Open a device port                             |
| serial/close     | Close a device port                            |
| serial/write     | device send a write request for changing value |
| serial/read      | Read value from device                         |
| serial/scanPorts | Handle process of scaning availble ports       |
| serial/openPort  | A process of open ports of device              |
| serial/closePort | A process of close ports of device             |
| serial/writePort | A process of write ports of device             |

### Response Codes

[Recommended HTTP response code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

| Code | response status        |
|:-----|:-----------------------|
| 200  | OK (request succeeded) |
| 201  | Created                |
| 400  | bad request            |
| 401  | Unauthorized           |
| 404  | Not found              |
| 500  | Internal server errors |

## Instruction

### Directory Structure

```
Smart Home
│   README.md
│   README.txt    
│
├───AWS
│   │   package.json
│   │   db.js
│   │   app.js
│   │   ...
│   │
│   ├───bin 
│   │   │ ...
│   │
│   ├───models
│   │   │ ...
│   │
│   ├───public
│   │   │ ...
│   │
│   ├───routes
│   │   │ ...
│   │
│   └───views
│       │ ...
│    
├───Localhost
│   │
│   ├───public
│   │   │ ...
│   │
│   └───routes
│       │ ...
│
│
├───Particle
│   │
│   └───src
│       │ ...    
│
│
└───docs
    │   index.md
    │   ...
```

### Installation

```bash
# go to directory of AWS server
cd AWS
# Install all dependencies
npm install
# Run server 1
npm start
# Debug mode
Debug=AWS:* npm start
```


