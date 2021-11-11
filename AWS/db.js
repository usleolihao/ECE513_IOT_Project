// to use mongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/ECE513", { useNewUrlParser: true, useUnifiedTopology:true });


module.exports = mongoose;
