var express = require('express');
var router = express.Router();
var Recording = require("../models/lab_8_7");

// CRUD implementation

router.post("/register", function(req, res) {
    const record = new Recording({
         zip: req.body.zip,
         airQuality: req.body.airQuality
    });
    record.save(function(err, stu) {
      if (err) {
         var errormsg = {"error" : "zip and airQuality are required."};
         res.status(400).json(errormsg);
      } 
      else {
         let msgStr = `zip (${req.body.zip}) with airQuality (${req.body.airQuality}) has been saved.`;
         var msg = {"response" : "Data recorded."};
         res.status(201).json(msg);
         console.log(msgStr);
      }
   });
});


router.get('/status', function (req, res) {
   let zip = req.query.zip;
   //If the zip is not specified or is invalid return with a 400 code.
   if (!zip || !/^\d{5}/.test(zip)){
      var errormsg = {"error" : "a zip code is required."};
      res.status(400).json(errormsg);
   }else{
      //the zip is valid, but no data exist
      Recording.find({ "zip": zip }, function (err, docs) {
         if (docs.length == 0) { 
            var errormsg = {"error" : "Zip does not exist in the database."};
            res.status(400).json(errormsg); 
         } else {
            let sumOfquality = 0;
            for (let each of docs){
               //sumOfquality += each.airQuality.toFixed(2);
               sumOfquality += each.airQuality;
               
            }
            let average = parseFloat(sumOfquality/docs.length).toFixed(2);
            console.log(average);
            res.status(200).json(average); 
         }
      });
   }
   
});


module.exports = router;