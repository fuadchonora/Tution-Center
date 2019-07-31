var express = require('express');
var app = express();

try{

app.get('/', function(req, res) {
	// to views student page for testing
	res.end('Student Page')
});

app.post('/login', function(req,res,next){

    req.assert('reg_no', 'Register No. is Required').notEmpty()
    req.assert('dob', 'Date of Birth is Required').notEmpty()
  
    var errors = req.validationErrors()
  
    if(!errors){   //validation successfull
  
      var values = [
        req.sanitize('reg_no').escape().trim(),
        req.sanitize('dob').escape().trim()
      ]
  
      console.log(values);
  
      req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM students WHERE pk_int_std_id = ? and date_std_dob = ?', values, function(err, rows, fields) {
          if(err) throw err
          
          // if user not found
          if (rows.length <= 0) {
            req.flash('error', 'Invalid Reg. No. or Date of Birth')
            res.send({
              message: 'Invalid Reg. No. or Date of Birth'
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

}catch(e){
  console.log('error', e)
  res.send({ 
      message: 'error',
      err_msg : e
  })
}
