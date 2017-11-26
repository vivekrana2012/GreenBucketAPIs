// requiring modules
var express=require('express');
var app=express();
var bodyParser=require('body-parser');

// url mapping
app.use(bodyParser.urlencoded({extended: true}), require('./authentication'));

// specify port to listen on
app.listen(9000);
console.log('Running on port 9000');
