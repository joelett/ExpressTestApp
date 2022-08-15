var express = require('express');
var router = express.Router();

//var subtle = crypto.webcrypto
let keys

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('chat.html')
});

router.get('/publicKey', async function(req,res){
    //console.log(publicKey.)
    //console.log(publicKey);
    keys = await generateKeys()
    console.log(await getPublicKey(keys))
    res.send({pk:await getPublicKey(keys)})

})

router.post('/message',async function(req,res){
    console.log(((req.body.message)))
    crypto.privateDecrypt(
        privateKey,
        Buffer.from(JSON.stringify(req.body.msg))
    ).then(msg=>{
        res.send({
            "msg":"You said: "+msg,
            "name":"Server"
        })
    })
})



async function generateKeys(){
    const options = {
      name: 'RSA-PSS',
      modulusLength: 2048, 
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' }, 
    };


    const keys =  subtle.generateKey(
      options,
      true,
      ['sign', 'verify'],
    );
    console.log(keys)
  
    return keys;
  }
  
  
  async function getPublicKey(keys){
      const publicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
      let body = window.btoa(String.fromCharCode(...new Uint8Array(publicKey)));
      return body;
  }
  
  async function getPrivateKey(keys){
      const privateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);
      let body = window.btoa(String.fromCharCode(...new Uint8Array(privateKey)));
      return body;
  }
  


module.exports = router;
