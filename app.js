//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

userSchema =new mongoose.Schema( {
  email: {
    type: String,
    required: true
  },
  password:{
    type:String,
    required:true
  }
});

const secret=process.env.SECRET;

userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);


app.get("/",function(req,res){
  res.render("home");
});




app.route("/register").get(function(req,res){
    res.render("register");
}).post(function(req,res){

  const user=new User({ email: req.body.username,password:  req.body.password});
  user.save(function(err){
    if(!err)
{
    console.log("saved user");
      res.render("secrets");
      }
  });
});

app.route("/login").get(function(req,res){
    res.render("login");
}).post(function(req,res){

User.findOne({ email: req.body.username,password:  req.body.password }, function (err, user) {
  if(!err && user){
      res.render("secrets");
  }else if(!user){
      res.render("home");
  }
});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
