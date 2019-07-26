var express = require('express');
var app = express();

app.get('/', function(req, res) {
	// to views admin page template
	res.end('Admin Page')
});


app.post('/login', function(req,res){
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
        conn.query('SELECT * FROM admin WHERE var_admin_username = ? and var_admin_password = ?', values, function(err, rows, fields) {
          if(err) throw err
          
          // if user not found
          if (rows.length <= 0) {
            req.flash('error', 'Invalid Username or Password')
            res.send({
              message: 'Invalid Username or Password'
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
          
          /**
           * Using req.body.name 
           * because req.param('name') is deprecated
           */ 
          res.send({ 
              message: 'error',
              err_msg : error_msg
          })
  
    }
});
    

app.post('/add-class',function(req,res){

    req.assert('class_name', 'Class Name is Required').notEmpty();
    req.assert('tutor_id', 'Tutor Name is Required').notEmpty();

    var errors = req.validationErrors();

    if(!errors){  //validation Successfull
        let values= {
            "var_class_name": req.sanitize('class_name').escape().trim(),
            "fk_int_tutor_id": req.sanitize('tutor_id').escape().trim()
        }

        req.getConnection(function(error, conn){

            conn.query('SELECT * FROM class WHERE var_class_name = ?', req.sanitize('class_name').escape().trim(), function(err, rows, fields) {
                if(err){
                    req.flash('error', err)
                    res.send({
                        message: 'Error in adding Class',
                        err_msg : err
                    })
                    throw err
                }
                
                
                if (rows.length <= 0) {   // if class not exist

                    conn.query('INSERT INTO class SET ?',values, function(err, result){
                        if (err) {
                            req.flash('error', err)
                            
                            // error in adding class
                            res.send({
                                message: 'Error in adding Class',
                                err_msg : err
                            })
                        } else {
                            req.flash('success', 'Data added successfully!')
                            
                            // render success message
                            res.send({
                                message: 'Added New Class',
                                result : result
                           })
                        }
                    })
                }
                else { // if class exist
                    res.send({
                        message: 'Class already exist',
                        result: rows
                    })
                }
            })

        })

    }else {   //Display validation errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
        req.flash('error', error_msg)	
        console.log('error', error_msg)	
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.send({ 
            message: 'error',
            err_msg : error_msg
        })
    }

});


app.post('/add-subject',function(req,res){

    req.assert('sub_name', 'Class Name is Required').notEmpty();
    req.assert('teacher_id', 'Teacher Name is Required').notEmpty();

    var errors = req.validationErrors();

    if(!errors){  //validation Successfull
        let values= {
            "var_sub_name": req.sanitize('sub_name').escape().trim(),
            "fk_int_teacher_id": req.sanitize('teacher_id').escape().trim()
        }

        req.getConnection(function(error, conn){

            conn.query('SELECT * FROM subject WHERE var_sub_name = ?', req.sanitize('sub_name').escape().trim(), function(err, rows, fields) {
                if(err){
                    req.flash('error', err)
                    res.send({
                        message: 'Error in selection of Subject',
                        err_msg : err
                    })
                    throw err
                }
                
                
                if (rows.length <= 0) {   // if not exist not exist

                    conn.query('INSERT INTO subject SET ?',values, function(err, result){
                        if (err) {
                            req.flash('error', err)
                            
                            // render error message to user (temporary)
                            if(err.errno==1452){
                                console.log('Select a Valid Teacher')
                                res.send({
                                    message: 'Select a valid Teacher',
                                    err_msg : err
                                })
                            }else{
                                res.send({
                                    message: 'Error in adding Subject',
                                    err_msg : err
                                })
                            }
                        } else {
                            req.flash('success', 'Data added successfully!')
                            
                            // render success message
                            res.send({
                                message: 'Added New Subject',
                                result : result
                           })
                        }
                    })
                }
                else { // if subject exist
                    res.send({
                        message: 'Subject already exist',
                        result: rows
                    })
                }
            })

        })

    }else {   //Display validation errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
        req.flash('error', error_msg)	
        console.log('error', error_msg)	
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.send({ 
            message: 'error',
            err_msg : error_msg
        })
    }

});


app.post('/add-student',function(req,res){

    req.assert('class_id', 'Class Name is Required').notEmpty();
    req.assert('reg_no', 'Register Number is Required').notEmpty();
    req.assert('std_name', 'Student Name is required').notEmpty();
    req.assert('std_dob', 'Date of Birth is Required').notEmpty();
    req.assert('std_gender', 'Gender is Required').notEmpty();
    req.assert('std_ph', 'Phone No. is Required').notEmpty();
    req.assert('std_email', 'E-mail id is Reqi=uired').notEmpty();
    req.assert('std_address', 'Address is Required').notEmpty();

    var errors = req.validationErrors();

    if(!errors){
        // Validation Successfull
        let values = {
            fk_int_class_id : req.sanitize('class_id').escape().trim(),
            int_reg_no : req.sanitize('reg_no').escape().trim(),
            var_std_name : req.sanitize('std_name').escape().trim(),
            date_std_dob : req.sanitize('std_dob').escape().trim(),
            var_std_gender : req.sanitize('std_gender').escape().trim(),
            var_std_ph : req.sanitize('std_ph').escape().trim(),
            var_std_email : req.sanitize('std_email').escape().trim(),
            var_std_address : req.sanitize('std_address').escape().trim()
        }

        req.getConnection(function(error, conn){
            conn.query('INSERT INTO students SET ?',values, function(err, result){
                if (err) {
                    
                    // error in adding student
                    req.flash('error', err)

                    // render error message to user (temporary)
                    if(err.errno==1452){
                        console.log('Select a Valid Class')
                        res.send({
                            message: 'Select a valid Class',
                            err_msg : err
                        })
                    }else{
                        res.send({
                            message: 'Error in adding Student',
                            err_msg : err
                        })
                    }
                    
                } else {
                    req.flash('success', 'Data added successfully!')
                    
                    // render success message
                    res.send({
                        message: 'Added New Student',
                        result : result
                   })
                }
            })
        })
    }else{
        // Validation error occures
        var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
        req.flash('error', error_msg)	
        console.log('error', error_msg)	
        
        //display validation errors to user (temporary)
        res.send({ 
            message: 'error',
            err_msg : error_msg
        })
    }

});


app.post('/add-time-table',function(req,res){
    let tt_id=req.body.tt_id;
    let teacher_id=req.body.teacher_id;
    let tt_day=req.body.tt_day;
    let tt_period=req.body.tt_period;
    let class_id=req.body.class_id;


    console.log("Teacher Id is "+teacher_id);

    var sql = "INSERT INTO time_table ( pk_int_tt_id, fk_int_teacher_id, var_day, var_period, fk_int_class_id) VALUES ?";
    var values = [
        [tt_id,teacher_id,tt_day,tt_period,class_id]
    ];

    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.end("Inserted");
    });

});

module.exports = app;