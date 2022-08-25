let express = require('express');
let multer = require('multer');
let stream = require('stream');
let fs = require("fs")
let router = express.Router();

let {PeerServer} = require("peer")
let peerServer = PeerServer({port:9002,path:'/lsps'})


const bodyParser = require('body-parser');
const { Console } = require('console');

const rawBodySaver =  (req, res, buf, encoding) =>{
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

const options = {
  verify: rawBodySaver
};

router.use(bodyParser.json(options))


router.get("/", (req, res) => {
    res.render("livesupport.html")
});

let upload = multer()//{dest:"uploads/"}
let lastupload

router.post("/send",upload.single('featuredVid'),(req,res)=>{
    //console.log(req.file)
    lastupload=req.file
    res.status(200).send("ok")
    
    // Everything went fine.
})

router.get("/rec",(req,res)=>{
    console.log("REC")

    res.write(lastupload.buffer,'binary');
    res.end(null, 'binary');
})


module.exports = router;