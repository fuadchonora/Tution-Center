let bcrypt = require('bcrypt-nodejs');

module.exports = function(app, connection) {

  app.post('/teacher/login', function (req,res,next) {
    let username=req.body.username;
    let password=req.body.password;

    connection.query("SELECT * FROM teacher WHERE var_teacher_username = '"+username+"' and var_teacher_password = '"+password+"'", function (err, result, fields)  {
      if(!err){
        console.log('type',typeof(result));
        if(result.length){
          console.log(username+' '+password);
          console.log(result);
          res.end('Login Success');

        }else {
          res.end('Invalid Username or Password');
        }

      }else {
          console.log('Server Error');
      }
    
    });

  });


  app.post('/teacher/sign-up',function(req,res){
    let teacher_name=req.body.teacher_name;
    let teacher_gender=req.body.teacher_gender;
    let teacher_dob=req.body.teacher_dob;
    let teacher_ph=req.body.teacher_ph;
    let teacher_email=req.body.teacher_email;
    let teacher_address=req.body.teacher_address;
    let teacher_username=req.body.teacher_username;
    let teacher_password=req.body.teacher_password;
    
    let teacher_status=0;
  
    
    console.log("Teacher Name is "+teacher_name);
  
    var sql = "INSERT INTO teacher (var_teacher_name, var_teacher_gender, date_teacher_dob, var_teacher_ph, var_teacher_email, var_teacher_address, var_teacher_username, var_teacher_password, var_teacher_status) VALUES ?";
    
    var values = [
      [teacher_name, teacher_gender, teacher_dob, teacher_ph, teacher_email, teacher_address, teacher_username, teacher_password, teacher_status]
    ];
    
    connection.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
      res.end("Inserted");
    });
    
  });

}