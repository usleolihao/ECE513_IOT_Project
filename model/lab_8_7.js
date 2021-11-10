const db = require("../db");
const mongoose = require("mongoose");


/* your schema here */
const studentSchema = new mongoose.Schema({
    name:      String,
    major:     String,
    gpa:       { type: Number, min: 0, max: 4 }
 });

const Student = db.model("Student", studentSchema);



module.exports = Student;


// references
// https://learn.zybooks.com/zybook/ARIZONAECE413513HongFall2021/chapter/8/section/2
// https://www.geeksforgeeks.org/mongoose-estimateddocumentcount-function/ 
// https://www.geeksforgeeks.org/mongoose-find-function/
// https://www.geeksforgeeks.org/mongoose-findoneandupdate-function/
// https://www.geeksforgeeks.org/mongoose-deleteone-function/
// https://docs.mongodb.com/manual/reference/operator/query/
