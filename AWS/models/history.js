// models/history.js
const db = require( "../db" );
const mongoose = require( "mongoose" )

const historySchema = new mongoose.Schema( {
    email: { type: String, required: true},
    temperature: { type: Number, required: true},
    humidity: { type: Number, required: true},
    power: { type: Number, required: true},
    created_at: { type: Date, default: Date.now }
} );

const History = db.model( "History", historySchema );

module.exports = History;