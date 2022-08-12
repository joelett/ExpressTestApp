var express = require('express');
var router = express.Router();
var fs = require("fs")

var userdata = require("../public/user.json");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user.html');
});

router.get('/userdata', function(req,res){
  let data = {"name":userdata.name,"age":userdata.age}
  res.send(data)
})

router.post('/senddata', function(req,res){
  console.log("sending data")
  if(req.body.password==userdata.password){
    userdata.name=req.body.name
    userdata.age=req.body.age

    fs.writeFile("./public/user.json", JSON.stringify(userdata), err=>{
      if(err) console.log(err)
    })

    res.status(200)
    res.send("200 - Data submitted")
  }else{
    res.status(401)
    res.send("401 - Wrong data!")
  }
})

//ROUTER LOGIN
router.get("/login",function(req,res){
  if(req.headers.inquiry=="Chef"){
    res.send({"respSite":"user/chef"})
  }else if(req.headers.inquiry=="USB"){
    res.send({"respSite":"user/usb"})
  }else{
    res.send({"respSite":"user"})
  }
})

router.get("/usb", function(req,res){
  res.render("usb.html")
})

router.get("/chef", function(req,res){
  res.render("chef.html")
})

module.exports = router;
