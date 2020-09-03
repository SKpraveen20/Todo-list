
const express    = require('express');
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/tododb",{useNewUrlParser:true});

const iSchema={
  name:String
};
const Item=mongoose.model("Item",iSchema);

const it1=new Item({
  name:"hello"
});
const it2=new Item({
  name:"click + to add and check it to delete items"
});
const defitems=[it1];

app.get("/",function(req,res)
{
  Item.find({},function(err,found){
    if(found==0){
      Item.insertMany(defitems,function(err){
        if(err){
          console.log(err)
        }
        else{
          console.log("success")
        }
      });
      res.redirect("/");
    }
    else{
      res.render("index",{day:"My to-do list",items:found});
    }
  })


});

app.post('/',function(req,res){
  let item= req.body.listItem;
  const itnew=new Item({
    name:item
  });
  itnew.save();
  res.redirect("/");
});


app.post("/delete",function(req,res){
  const checkedId=req.body.checkBox;
    Item.findByIdAndRemove(checkedId,function(err){
      if(!err){
        res.redirect("/");
      }});
});

app.listen(3000,function(){
  console.log('server running');
});
