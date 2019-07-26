var express = require('express');
var app = express();


app.get('/', function(req, res) {
	// to views teacher page for testing
	res.end('Teacher Page')
});

// TEACHER SIGNUP POST ACTION
app.post('/sign-up', function(req, res, next){
  req.assert('teacher_name', 'Name is required').notEmpty()
  req.assert('teacher_gender', 'Gender is required').notEmpty()
  req.assert('teacher_dob', 'Dob is required').notEmpty()
  req.assert('teacher_ph', 'Phone No. Required').notEmpty()
  req.assert('teacher_email', 'A valid email is required').isEmail()
  req.assert('teacher_address', 'Address is required').notEmpty()
  req.assert('teacher_username', 'Username is required').notEmpty()
  req.assert('teacher_password', 'Password is required').notEmpty()

  var errors = req.validationErrors()
    
  if( !errors ) {   //Passed Validation
    
		var values = {
			var_teacher_name: req.sanitize('teacher_name').escape().trim(),
			var_teacher_gender: req.sanitize('teacher_gender').escape().trim(),
      date_teacher_dob: req.sanitize('teacher_dob').escape().trim(),
      var_teacher_ph: req.sanitize('teacher_ph').escape().trim(),
      var_teacher_email: req.sanitize('teacher_email').escape().trim(),
      var_teacher_address: req.sanitize('teacher_address').escape().trim(),
      var_teacher_username: req.sanitize('teacher_username').escape().trim(),
      var_teacher_password: req.sanitize('teacher_password').escape().trim(),
      var_teacher_status:0
    }
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO teacher SET ?', values, function(err, result) {
				
				if (err) {
					req.flash('error', err)
					
					// display error message to user
					res.send({
            message: 'Error in adding Teacher',
            err_msg : err
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// display success message to user
					res.send({
            message: 'Added New Teacher',
            result : result				
					})
				}
			})
		})
	}
	else {   //Display errors to user if validation error occures
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
    req.flash('error', error_msg)	
    console.log('error', error_msg)	
		
        res.send({ 
            message: 'error',
            err_msg : error_msg
        })
    }
})


app.post('/login', function(req,res,next){

  req.assert('username', 'Username is required').notEmpty()
  req.assert('password', 'Password is required').notEmpty()

  var errors = req.validationErrors()

  if(!errors){   //validation successfull

    var values = [
      req.sanitize('username').escape().trim(),
      req.sanitize('password').escape().trim()
    ]

    console.log(values);

    req.getConnection(function(error, conn) {
      conn.query('SELECT * FROM teacher WHERE var_teacher_username = ? and var_teacher_password = ?', values, function(err, rows, fields) {
        if(err) throw err
        
        // if user not found
        if (rows.length <= 0) {
          req.flash('error', 'User not found')
          res.send({
            message: 'User Not Found'
          })
        }
        else { // if user found
          // render to user
          res.send({
            message: 'Login Success', 
            result: rows
          })
        }
      })
    })

  }else{   //Display errors to user  if validation error occures
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
    req.flash('error', error_msg)	
    console.log('error', error_msg)	
		
        res.send({ 
            message: 'error',
            err_msg : error_msg
        })

  }

})

module.exports = app;