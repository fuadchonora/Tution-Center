var express = require('express')
var app = express()

var mysql = require('mysql')

/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
var myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */ 
var config = require('./config')
var dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port, 
	database: config.database.db
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */ 
app.use(myConnection(mysql, dbOptions, 'pool'))


/**
 * import routes
 */ 
var router = require('./router');


/**
 * Express Validator Middleware for Form Validation
 */ 
var expressValidator = require('express-validator')
app.use(expressValidator())


/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input 
 * and store it as javascript object
 */ 
var bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


/**
 * This module shows flash messages
 * generally used to show success or error messages
 * 
 * Flash messages are stored in session
 * So, we also have to install and use 
 * cookie-parser & session modules
 */
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())


app.use('/', router)

app.listen(3000, function(){
	console.log('Server running at port 3000: http://127.0.0.1:3000')
})













// require('./routes')(app, connection);

// module.exports = function(app, db) {
// require('./server/service/organisation')(app, db);
// };


// module.exports = (app, db)=>{
// };


// page1

// funA =(arg1,arg2,arg3) => {
// }

// funB =() => {
// }

// module.exports={adduser:funA,updateUser:funB}



// page2

// module.exports = {

// fun1:newfunction=(arg1,arg2,arg3)=> {

// }


// }




// page3

// const path = require('../../..');
// path.funcationname
