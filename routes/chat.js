var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(tries>0){
        res.render('chat.html')
    }else{
        res.render("loginfailed.html");
    }
});

router.post('/message',function(req,res){
    
    res.send({
        "msg":"You said: "+req.body.message,
        "name":"Server"
    })
})


let tries = 3
let password="password"
router.post("/login",function(req,res){
    if(tries>0){
    if(req.body.pass==password){
        res.send({html:'<div id="messages" class="msg"><p>Messages will appear here:</p></div><form id="umsg" onsubmit="return false;"><input type="text" class="msg" id="msg"><input type="submit"></form>'})
    }else{
        res.status(401)
        tries--;
            if(tries==0){
                let t = setTimeout(a=>{
                    tries=3
                },30000)
                res.send({reload:true});
            }else{
                res.send({"smsg":"Wrong password! Please try again! "+tries+" tries left."})
            }
        }
    }else{
        res.send({reload:true});
    }
})
  


module.exports = router;
