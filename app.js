//jshint esversion:6

const express= require("express");
const bodyParser=require("body-parser");
const app= express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var newListItem= [];

app.get("/",function(req,res){
  var today=new Date;
  let options={
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  var day= today.toLocaleDateString("en-US",options);
  res.render("list",{days:day,newItems:newListItem });
})
app.post("/",function(req,res){
  var newitem=req.body.item;
  newListItem.push(newitem);
  res.redirect("/");


});

app.listen("3000",function(req,res){
  console.log("server started");
})
