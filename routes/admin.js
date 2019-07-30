var express = require('express');
var app = express();
var multer = require('multer')

//file upload
var storage = multer.diskStorage({
    destination:  (req, file, cb) => {
      cb(null, 'assets/images/'); /* cb(null, 'src/assets/img/');*/
    },
    filename:  (req, file, cb) => {
      let dateTimeStamp = Date.now();
      let fileName = file.fieldname + '-' + dateTimeStamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]
      cb(null, fileName);
    }
});

var upload = multer({ storage: storage }).single('file')

app.get('/', function(req, res) {
	// to views admin page template
	res.end('Admin Page')
});

//POST METHOD FOR ADMIN LOGIN
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
          
          res.send({ 
              message: 'error',
              err_msg : error_msg
          })
  
    }
});

//POST METHOD FOR ADDING NEW CALSS
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
		
        res.send({ 
            message: 'error',
            err_msg : error_msg
        })
    }

});

//POST METHOD FOR ADDING NEW SUBJECT
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
        
                }
                
                
                if (rows.length <= 0) {   // if not exist

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
		
        res.send({ 
            message: 'error',
            err_msg : error_msg
        })
    }

});

//POST METHOD FOR REGISTERING NEW STUDENT
app.post('/add-student',function(req,res){

    console.log(req.file)


        upload (req,res,function(err){
            if(err){
                req.flash('Error', 'Error in uploading Files')
                res.send({
                    message: 'Error in uploading Files',
               })
            }
            let uploadstatus = "Uploaded Successfully"
        })


    

    req.assert('class_id', 'Class Name is Required').notEmpty();
    req.assert('std_name', 'Student Name is required').notEmpty();
    req.assert('std_dob', 'Date of Birth is Required').notEmpty();
    req.assert('std_gender', 'Gender is Required').notEmpty();
    req.assert('std_ph', 'Phone No. is Required').notEmpty();
    req.assert('std_email', 'E-mail id is Required').notEmpty();
    req.assert('std_address', 'Address is Required').notEmpty();

    var errors = req.validationErrors();

    if(!errors){
        // Validation Successfull
        let values = {
            fk_int_class_id : req.sanitize('class_id').escape().trim(),
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

//POST METHOD FOR ADDING TIME TABLE
app.post('/add-time-table',function(req,res){
    
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

//POST METHOD FOR ADDING A FEE
app.use('/add-fee', function(req,res){

    req.assert('fee_type', 'Fee Type is Required').notEmpty();
    req.assert('fee_name', 'Fee Type is Required').notEmpty();
    req.assert('last_date', 'Last Date is Required').notEmpty();

    var errors = req.validationErrors();

    if(!errors){
        // Validation Successfull
        let values = {
            var_fee_type : req.sanitize('fee_type').escape().trim(),
            var_fee_name : req.sanitize('fee_name').escape().trim(),
            date_fee_last_date : req.sanitize('last_date').escape().trim()
        }

        req.getConnection(function(error, conn){
            conn.query('INSERT INTO fees SET ?',values, function(err, result){
                if (err) {
                    
                    // error in adding Fee
                    req.flash('error', err)

                    res.send({
                        message: 'Error in adding Fee',
                        err_msg : err
                    })
                    
                } else {
                    req.flash('success', 'Fee added successfully!')
                    
                    // render success message
                    res.send({
                        message: 'Added New Fee',
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

})

//POST METHOD FOR ADDING A PAID FEE
app.use('/add-paid-fee', function(req,res){

    req.assert('fee_id', 'Exam Name is Required').notEmpty();
    req.assert('std_id', 'Student Name is Required').notEmpty();
   

    var errors = req.validationErrors();

    if(!errors){
        // Validation Successfull
        let values = {
            fk_int_fee_id : req.sanitize('fee_id').escape().trim(),
            fk_int_std_id : req.sanitize('std_id').escape().trim(),
            var_fee_paid_status : 1,
            date_fee_paid : "2017-05-21"
        }

        req.getConnection(function(error, conn){
            conn.query('INSERT INTO fees_paid SET ? ',values, function(err, result){
                if (err) {
                    
                    // error in adding paid fee
                    
                    if(err.errno==1452){
                        req.flash('Exam or Student Doesn not Exist', err)
                        res.send({
                            message: 'Exam or Student Doesn not Exist',
                            err_msg : err
                        })
                    }else{
                        req.flash('Error in adding Paid Fee', err)
                        res.send({
                            message: 'Error in adding Paid Fee',
                            err_msg : err
                        })
                    }
                    
                } else {
                    req.flash('success', 'Paid Fee added successfully!')
                    
                    // render success message
                    res.send({
                        message: 'Added New Paid Fee',
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

})

module.exports = app;