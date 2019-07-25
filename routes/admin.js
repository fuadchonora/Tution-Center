var express = require('express');
var app = express();

app.get('/', function(req, res) {
	// to views admin page template
	res.end('Admin Page')
});


app.post('/login', function(req,res){
    if(req.session.admin_id){
        res.end(req.session.admin_id+" already signed in");
    }

    console.log(req.session.admin_id);
  
    let username=req.body.username;
    let password=req.body.password;
  
    connection.query("SELECT * FROM admin WHERE var_admin_username = '"+username+"' and var_admin_password = '"+password+"'", function (err, result, fields)  {
        if(!err){
            console.log('type',typeof(result));
            if(result.length){
                console.log(username+' '+password);
                console.log(result);
                req.session.admin_id=result.admin_id;
                res.end('Login Success');
  
            }else {
                res.end('Invalid Username or Password');
            }
  
        }else {
            console.log('Server Error');
        }
      
    });
});
    

app.post('/add-class',function(req,res){
    var class_name=req.body.class_name;
    var tutor_id=req.body.tutor_id;
    console.log("Class Name is "+class_name+", tutor id is "+tutor_id);

    var sql = "INSERT INTO class (var_class_name, fk_int_tutor_id) VALUES ?";
    var values = [
        [class_name, tutor_id]
    ];
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.end("Inserted");
    });

});


app.post('/add-subject',function(req,res){
    var sub_name=req.body.sub_name;
    var teacher_id=req.body.teacher_id;
    console.log("Subject Name is "+sub_name+", teacher id is "+teacher_id);

    var sql = "INSERT INTO subject (var_sub_name, fk_int_teacher_id) VALUES ?";
    var values = [
        [sub_name, teacher_id]
    ];

    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.end("Inserted");
    });

});


app.post('/add-student',function(req,res){
    let class_id=req.body.class_id;
    let reg_no=req.body.reg_no;
    let std_name=req.body.std_name;
    let std_dob=req.body.std_dob;
    let std_gender=req.body.std_gender;
    let std_ph=req.body.std_ph;
    let std_email=req.body.std_email;
    let std_address=req.body.std_address;

    console.log("Student Name is "+std_name);

    var sql = "INSERT INTO students (fk_int_class_id, int_reg_no, var_std_name,date_std_dob, var_std_gender, var_std_ph, var_std_email, var_std_address) VALUES ?";
    var values = [
        [class_id, reg_no, std_name, std_dob, std_gender, std_ph, std_email,std_address]
    ];

    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.end("Inserted");
    });

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