// models/user.js
const db = require( "../db" );
const mongoose = require( "mongoose" )

const deviceSchema = new mongoose.Schema( {
    email: { type: String, required: true},
    deviceid: { type: String, required: true },
    deviceapi: { type: String, required: true },
    updated_at: { type: Date, default: Date.now }
} );

const Device = db.model( "Device", deviceSchema );

module.exports = Device;