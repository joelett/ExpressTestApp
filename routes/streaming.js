let express = require('express');
let router = express.Router();

let {PeerServer} = require("peer")
let peerServer = PeerServer({port:9001,path:'/streaming'})

//router.use(peerServer)

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('streaming.html', { title: 'Stream' });
//});


router.get("/", (req, res) => {
  res.render("streaming.html")
});

router.post("/sendData",(req, res) => {
  console.log(req.body)
  res.send(req.body)
})



module.exports = router;
