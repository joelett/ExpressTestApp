var express = require('express');
var router = express.Router();
let crypto = require('crypto');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(tries>0){
        res.render('chat.html')
    }else{
        res.render("loginfailed.html");
    }
});


let pubKey
let privKey


router.get('/getPubKey',async function(req,res){
    await crypto.generateKeyPair('rsa',{
        modulusLength: 1024,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    }, (err, publicKey,privateKey)=>{
        if(err){
        console.log("Error: "+err);
        }
    
        pubKey = publicKey
        privKey = privateKey
    })

    console.log(pubKey)
    res.send({public:pubKey})
})



router.post('/message',function(req,res){
    
    res.send({
        "msg":"You said: "+req.body.message,
        "name":"Server"
    })
})


let tries = 99//TODO CHANGE BACK
let password="password"
router.post("/login",function(req,res){
    console.log(req.body)
    let dec = crypto.privateDecrypt(privKey,Buffer.from((req.body.pass)))
    console.log(dec)


    if(tries>0){
    if(req.body.pass==password){
        res.send({html:'<div id="messages" class="msg"><p>Messages will appear here:</p></div><form id="umsg" onsubmit="return false;"><input type="text" class="msg" id="msg"><input type="submit"></form>'})
    }else{
        res.status(401)
        tries--;
            if(tries==0){
                let t = setTimeout(a=>{
                    tries=5
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
