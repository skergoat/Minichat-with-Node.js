const mongoose = require('mongoose'); // import mongoose 
mongoose.Promise = require('bluebird');	
const  url  =  "mongodb://localhost:27017/chat"; // create database 
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });	// connect to db 
module.exports = connect; // export to app.js 

