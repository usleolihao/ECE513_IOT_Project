// models/user.js
const db = require( "../db" );
const mongoose = require( "mongoose" )

const userSchema = new mongoose.Schema( {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    zip: { type: String, unique: false, default: "00000" },
    devices: [ String ],
    admin: { type: Boolean, default: false },
    dashboard: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
} );

const User = db.model( "User", userSchema );

module.exports = User;