let express = require('express');
let router = express.Router();

let { v4: uuidv4 } = require("uuid");

const server = require("http").Server(router)

const io = require("socket.io") (server)
let {ExpressPeerServer} = require("peer")

const peerServer = ExpressPeerServer(server, {
  debug:true
})

router.use("peerjs",peerServer);

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('streaming.html', { title: 'Stream' });
//});

router.get("/", (req, res) => {
  res.redirect(`streaming/${uuidv4()}`);
});

router.get("/:room",(req, res) => {
  res.render("streaming.html", { roomId: req.params.room });
});


io.on("connection",(socket)=>{
  socket.on("join-room",(roomId,userId)=>{
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected",userId)
  })
})

server.listen(3001);


module.exports = router;
