// how to use?
// 1. install serialport: npm install serialport
// 2. run this localhost: node localhost.js
// 3. using your web browser, access localhost:3000 
// 4. you can control your particle device

// for simple http server
const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

var serialcommRouter = require('./routes/serialcomm');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Static file hosting
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(rxStr);
});
app.use('/serial', serialcommRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

