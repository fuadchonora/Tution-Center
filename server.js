let express = require('express');
var mysql = require('mysql');
var bodyParser = require("body-parser");

let router = express.Router();
let app = express();


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tution_center'
});

connection.connect(function(err) {
    if(err){
      console.log('Database Connection Error.!');
      throw err;
    }
    console.log('Database Connected.');
    app.router("../")   
    app.listen(3000,function(){
      console.log("Started on PORT 3000");
    });
    
});