var express = require('express')
var app = express()

app.get('/', function(req, res) {
	// to views home page template
	res.end('My Node.js Application')
});

/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;
