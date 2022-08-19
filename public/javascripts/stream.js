//let MediaStreamRecorder = require("msr")
//////////////////////////////////////
///https://levelup.gitconnected.com/building-a-video-chat-app-with-node-js-socket-io-webrtc-26f46b213017

/*var peer = new Peer({
    host: "localhost",
    port: 9000,
    path: "/stream",
    pingInterval: 5000,
    debug: true,
    config: { 'iceServers': [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "turn:0.peerjs.com:3478", username: "peerjs", credential: "peerjsp" }
    ],
    sdpSemantics: "unified-plan",
    iceTransportPolicy: "relay" }
  });*/
  var peer = new Peer({
    host: '127.0.0.1',
    port: 9000,
    path: '/streaming',
    config: { 'iceServers': [
    { url: 'stun:stun01.sipphone.com' },
    { url: 'stun:stun.ekiga.net' },
{ url: 'stun:stunserver.org' },
{ url: 'stun:stun.softjoys.com' },
{ url: 'stun:stun.voiparound.com' },
{ url: 'stun:stun.voipbuster.com' },
{ url: 'stun:stun.voipstunt.com' },
{ url: 'stun:stun.voxgratia.org' },
{ url: 'stun:stun.xten.com' },
{
    url: 'turn:192.158.29.39:3478?transport=udp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
},
{
    url: 'turn:192.158.29.39:3478?transport=tcp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
    }
  ]
   },

debug: 3
});







window.addEventListener("DOMContentLoaded",init)

let streambtn,watchbtn,videogrid,video
let peerconbtn, peerIdInput, callbtn

function init(){
    streambtn=document.getElementById("streambtn")
    watchbtn=document.getElementById("watchbtn")
    videogrid=document.getElementById("video-grid")
    video=document.getElementById("video")
    streambtn.addEventListener("click",startStreaming)
    
    peerIdInput = document.getElementById("Peer-ID")
    peerconbtn = document.getElementById("connect")
    callbtn = document.getElementById("call")
    peerconbtn.addEventListener("click",connectToPeer)
    callbtn.addEventListener("click",callPeer)

    peer.on('open', function(id){
        console.log("My peer ID is: "+id)
        document.getElementById("peerID").innerText=id
    })
}

let call
let stream
async function startStreaming(){
    stream = await navigator.mediaDevices.getDisplayMedia()
    video.srcObject=stream
}

async function callPeer(){
    console.log("CALLING")
    call = peer.call(peerIdInput.value,stream)
    call.on('stream',function(stream){
        console.log("STREAMING")
        let v = document.createElement("video");
        v.srcObject=stream
        videogrid.appendChild(v)
        v.play()
    })
}
peer.on('call',function(call){
    console.log("ANSWERING")
    call.answer(stream);
    call.on('stream',function(stream){
        console.log("STREAMING")
        let v = document.createElement("video");
        v.srcObject=stream
        videogrid.appendChild(v)
        v.play()
    })
})


let conn = peer.connect()
async function connectToPeer(){
    console.log("Connecting to "+peerIdInput.value)
    conn = await peer.connect(peerIdInput.value)
    conn.on('open', function(){
        console.log(conn.peer+" "+conn.open)
        conn.send("HELLO WORLD!!!!!!!!!!!!!!!!!")
});
console.log(conn.peer+" "+conn.open)
}


peer.on('connection', function(conn) {
    console.log("Connection "+conn.peer+" "+conn.open+" ")
    conn.on('open',function(){
        console.log("OPENED")
    })

    conn.on('data', function(data){
      // Will print 'hi!'
      console.log("RECEIVED: "+data);
    });
  });

