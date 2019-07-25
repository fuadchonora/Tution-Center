var express = require('express')
var app = express()

var index = require('./routes/index')
var admin = require('./routes/admin')
var teacher = require('./routes/teacher')

app.use('/', index)
app.use('/admin', admin)
app.use('/teacher', teacher)

module.exports= app;