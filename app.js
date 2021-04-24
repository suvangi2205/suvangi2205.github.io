//jshint esversion:6

const express= require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const app= express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true},{useUnifiedTopology:true});
const itemsSchema = {
  name: String
};

const Item =mongoose.model("Item", itemsSchema);

const a= new Item({
  name: "Welcome to your todolist!"
});

const b= new Item({
  name: "Hit the + button to add a </br> new button."
});

const c= new Item({
  name: "<-- Hit this to delete an item"
})

const defaultItems=[a,b,c];

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);



app.get("/",function(req,res){
    Item.find({},function (err,foundItems) {

      if(foundItems.length===0){
        Item.insertMany(defaultItems,function(err){
          if(err){
          console.log(err);
        }else {
            console.log("Successfully saved.");
          }
        });
        res.redirect("/");
      }
      else{
      res.render("list",{days:"Today",newItems:foundItems });
    }
    });

});

app.get("/:customListName",function(req,res){
  const name=_.capitalize(req.params.customListName);
  List.findOne({name:name},function(err,foundList){
    if(!err){
      if(!foundList){
        const list=new List({
          name:name,
          items:defaultItems
        });
        list.save();
        res.redirect("/"+name);
      }else{
        res.render("list",{days: foundList.name, newItems:foundList.items});
      }
      }
    })

  const list=new List({
    name:name,
    items:defaultItems
  });
  list.save();
});
app.post("/",function(req,res){
  const itemName=req.body.item;
  const listName= req.body.list;
  const item=new Item({
    name:itemName
  });
  if(listName === "Today"){

  item.save();
  res.redirect("/");
}
else{
  List.findOne({name:listName}, function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  });
}
});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;

  if(listName=== "Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
    if(err)
    console.log(err);
    else {
      console.log("succes");
      res.redirect("/");
    }
  });
}
  else {
    List.findOneAndUpdate(
      {name: listName},{$pull:{items:{_id: checkedItemId}}},function(err){
        if(!err)
        res.redirect("/"+listName);
        else {
          console.log(err);
        }
      }
    )
  }
});
app.listen("3000",function(req,res){
  console.log("server started");
})
