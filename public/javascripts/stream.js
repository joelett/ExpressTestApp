//let MediaStreamRecorder = require("msr")
//////////////////////////////////////
///https://levelup.gitconnected.com/building-a-video-chat-app-with-node-js-socket-io-webrtc-26f46b213017

var peer = new Peer({
    host: "localhost",
    port: 9000,
    path: "/streaming",
    pingInterval: 5000,
    debug: true,
    config: { 'iceServers': [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "turn:0.peerjs.com:3478", username: "peerjs", credential: "peerjsp" }
    ],
    sdpSemantics: "unified-plan",
    iceTransportPolicy: "relay" }
  });



window.addEventListener("DOMContentLoaded",init)

let streambtn,watchbtn,videogrid,video
let peerconbtn, peerIdInput

function init(){
    streambtn=document.getElementById("streambtn")
    watchbtn=document.getElementById("watchbtn")
    videogrid=document.getElementById("video-grid")
    video=document.getElementById("video")
    streambtn.addEventListener("click",startStreaming)
    
    peerIdInput = document.getElementById("Peer-ID")
    peerconbtn = document.getElementById("connect")
    peerconbtn.addEventListener("click",connectToPeer)

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


let conn = peer.connect()

async function connectToPeer(){
    console.log("Connecting to "+peerIdInput.value)
    conn = await peer.connect(peerIdInput.value)
    conn.on('open', function(){
        console.log(conn.peer+" "+conn.open)
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
      console.log(data);
    });
  });

