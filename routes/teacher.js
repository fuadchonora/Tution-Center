var express = require('express');
var app = express();
let bcrypt = require('bcrypt-nodejs');

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

    let password = req.sanitize('teacher_password').escape().trim()
    password = bcrypt.hashSync(password,bcrypt.genSaltSync(),null);
    
		var values = {
			var_teacher_name: req.sanitize('teacher_name').escape().trim(),
			var_teacher_gender: req.sanitize('teacher_gender').escape().trim(),
      date_teacher_dob: req.sanitize('teacher_dob').escape().trim(),
      var_teacher_ph: req.sanitize('teacher_ph').escape().trim(),
      var_teacher_email: req.sanitize('teacher_email').escape().trim(),
      var_teacher_address: req.sanitize('teacher_address').escape().trim(),
      var_teacher_username: req.sanitize('teacher_username').escape().trim(),
      var_teacher_password: password,
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

    let password = req.sanitize('password').escape().trim()
    

    req.getConnection(function(error, conn) {
      conn.query('SELECT * FROM teacher WHERE var_teacher_username = ?', req.sanitize('username').escape().trim(), function(err, rows, fields) {
        if(err) {
          req.flash('Server error', err)
          res.send({
            message: 'Server error'
          })
        }

        
        // if user not found
        if (rows.length <= 0) {
          req.flash('error', 'User not found')
          res.send({
            message: 'User Not Found'
          })
        }
        else { // if user found
          // render to user
          console.log(rows);

          if(bcrypt.compareSync(password,rows[0].var_teacher_password)){
            console.log(' login Success');
            req.flash('login Success')
            res.send({
              message: 'Login Success',
              data: rows[0],
            })
          }else {
              console.log(' Wrong Password');
              req.flash('error', 'Wrong Password')
              res.send({
                message: 'Wrong Password', 
                result: rows
              })
          }
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

//POST METHOD FOR ADDING ATTENDANCE
app.use('/add-attendance', function(req, res, next){
  req.assert('std_id', 'Student Name is Required').notEmpty();
  req.assert('atd_date', 'Date is Required').notEmpty();
  req.assert('atd_status', 'Status is Required').notEmpty();

  errors = req.validationErrors();

  if(!errors){
    //validation Successfull
    values = {
      fk_int_std_id : req.sanitize('std_id').escape().trim(),
      date_atd_date : req.sanitize('atd_date').escape().trim(),
      var_atd_status : req.sanitize('atd_status').escape().trim()
    }

    where = [
      req.sanitize('std_id').escape().trim(),
      req.sanitize('atd_date').escape().trim()
    ]

  	req.getConnection(function(error, conn) {

      conn.query('SELECT * FROM attendance WHERE fk_int_std_id = ? and date_atd_date = ?', where, function(err, rows, fields) {
        if(err) throw err
        
        // if attendance report not found
        if (rows.length <= 0) {
          conn.query('INSERT INTO attendance SET ?', values, function(err, result) {
				
            if (err) {
              req.flash('error', err)
              
              // display error message to user
              res.send({
                message: 'Error in Reporting Attendance',
                err_msg : err
              })
            } else {		
              req.flash('success', 'Attendance Reported successfully!')
              
              // display success message to user
              res.send({
                message: 'Attendance Reported successfully!',
                result : result				
              })
            }
          })
        }
        else { // if attendance report found

          values = [
            req.sanitize('atd_status').escape().trim(),
            req.sanitize('std_id').escape().trim(),
            req.sanitize('atd_date').escape().trim()
          ]

          conn.query('UPDATE attendance SET var_atd_status = ? where fk_int_std_id = ? and date_atd_date = ?', values, function(err, result) {
				
            if (err) {
              req.flash('error', err)
              
              // display error message to user
              res.send({
                message: 'Error in Updating Attendance',
                err_msg : err
              })
            } else {				
              req.flash('success', 'Attendance Report Updated successfully!')
              
              // display success message to user
              res.send({
                message: 'Attendance Report Updated successfully!',
                result : result
              })
            }
          })
        }
      })

		})
    
  }else{
    //if Validation error occures
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

//METHODE FOR ADDING EXERCISES
  app.use('/add-exercises', function(req, res, next){

    req.assert('std_id', 'Student Name is Required.').notEmpty();
    req.assert('exe_name', 'Exercise name is Required').notEmpty();
    req.assert('exe_desc', 'Exercise Description is Required').notEmpty();
    req.assert('exe_date_given', 'Current Date is Required').notEmpty();
    req.assert('exe_date_submission', 'Date of submission is Required').notEmpty();
    
    exe_status=0;
    
    errors = req.validationErrors();
  })



module.exports = app;