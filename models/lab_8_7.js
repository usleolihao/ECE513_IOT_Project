const db = require("../db");
const mongoose = require("mongoose");


/* your schema here */
const airQualitySchema = new mongoose.Schema({
    zip:            {type: Number},
    airQuality:     {type: Number}
 });

const Recording = db.model("Recording", airQualitySchema);

module.exports = Recording;


// references
// https://learn.zybooks.com/zybook/ARIZONAECE413513HongFall2021/chapter/8/section/2
// https://www.geeksforgeeks.org/mongoose-estimateddocumentcount-function/ 
// https://www.geeksforgeeks.org/mongoose-find-function/
// https://www.geeksforgeeks.org/mongoose-findoneandupdate-function/
// https://www.geeksforgeeks.org/mongoose-deleteone-function/
// https://docs.mongodb.com/manual/reference/operator/query/
