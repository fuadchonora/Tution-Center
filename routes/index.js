var express = require('express')
var app = express()

app.get('/', function(req, res) {
	// to views home page for testing
	res.end('My Node.js Application')
});

module.exports = app;
