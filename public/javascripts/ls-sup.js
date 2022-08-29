
window.addEventListener("DOMContentLoaded", init)

let supporter = false

let peer = new Peer({
    host: 'localhost',
    port: 9000,
    path: '/support',
    config: {
        'iceServers': [
            { url: 'stun:stun01.sipphone.com' },
        ]
    }, debug: 3
})
let conn
let pid

async function init() {
    peer.on('open', function (id) {
        pid = id;
        console.log("id: " + id)
    })


    //mediaStream.addTrack()
    mediaStream = new MediaStream((await navigator.mediaDevices.getUserMedia({video:false,audio:true})).getTracks())
    console.log((await navigator.mediaDevices.getUserMedia({video:false,audio:true})).getTracks())

    let vs = document.getElementsByTagName("ls-videos")[0].emptyCanvas.captureStream(25)
    console.log(vs.getVideoTracks()[0])
    mediaStream.addTrack(vs.getVideoTracks()[0])


    //mediaStream = await navigator.mediaDevices.getDisplayMedia()
    document.getElementsByTagName("ls-videos")[0].vidme.srcObject = mediaStream
    heartbeat()

    document.getElementsByTagName("ls-hangupbtn")[0].style.display = "none"

}

async function heartbeat(){
    if(sendHeartbeat){
        let resp = await fetch("/support/stillAlive",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:await JSON.stringify({
                id:pid
            })
        })
        if(resp.ok){
            let res = await resp.json()
            console.log(res)
            document.getElementsByTagName("ls-wait")[0].setActivation(res.wait)
        }
    }
    setTimeout(heartbeat,1000)
}

async function waitPlease(id){
    fetch("/support/waitForMe",{
        method:"POST",
            headers:{"content-type":"application/json"},
            body:await JSON.stringify({
                id:id,
                wait:true
            })
    })
}

let sendHeartbeat=false

async function sendIdToServer() {
    await fetch("/support/addToWaitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: await JSON.stringify({
            id: pid
        })
    })
    sendHeartbeat=true;
}

async function hangup() {
    await fetch("/support/remWaitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: await JSON.stringify({
            id: pid
        })
    })
    if(conn){
        conn.close()
        document.getElementsByTagName("ls-videos")[0].endCall()
        if(document.getElementsByTagName("ls-hangupbtn").length!=0){
            document.getElementsByTagName("ls-hangupbtn")[0].style.display = "none"
        }
    }

    sendHeartbeat=false
    document.getElementsByTagName("ls-wait")[0].setActivation(false)
}

async function retrieveWaitlist() {
    return await (await fetch("/support/getWaitlist")).json()
}

async function calling(id) {
    await fetch("/support/remWaitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: await JSON.stringify({
            id: id
        })
    })

    conn = peer.call(id, mediaStream)
    conn.on('stream', function (stream) {
        document.getElementsByTagName("ls-videos")[0].answerCall(stream)
        if(document.getElementsByTagName("ls-hangupbtn").length!=0){
            document.getElementsByTagName("ls-hangupbtn")[0].style.display = "block"
        }
    })
    conn.on('close',function(){
        document.getElementsByTagName("ls-videos")[0].endCall()
        if(document.getElementsByTagName("ls-hangupbtn").length!=0){
            document.getElementsByTagName("ls-hangupbtn")[0].style.display = "none"
        }
    })
}

let mediaStream = new MediaStream()

peer.on("call", function (call) {
    conn = call
    call.answer(mediaStream);
    call.on('stream', function (stream) {
        document.getElementsByTagName("ls-videos")[0].answerCall(stream)
    })
    document.getElementsByTagName("ls-wait")[0].setActivation(false)
    sendHeartbeat=false;
    call.on('close',function(){
        document.getElementsByTagName("ls-videos")[0].endCall()
    })
})

























class Request extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' })

        let requestFrame = document.createElement("div");
        requestFrame.style.display = "inline-block";
        requestFrame.style.backgroundColor = "#DDDDDD"
        requestFrame.style.width = 200;
        requestFrame.style.height = 200;
        requestFrame.style.margin = 5;

        this.nameText = document.createElement("p");
        this.nameText.innerText = "Name: " + this.name;
        requestFrame.appendChild(this.nameText)

        this.accept = document.createElement("button");
        this.accept.innerText = "Anruf annehmen";
        requestFrame.appendChild(this.accept)

        this.wait = document.createElement("button");
        this.wait.innerText = "Warten";

        this.waiting = document.createElement("p");
        this.waiting.style.color = "#FF0055"
        this.waiting.style.fontWeight = "bold"
        
        requestFrame.appendChild(this.wait)
        requestFrame.appendChild(this.waiting)

        //this.decline = document.createElement("button");
        //this.decline.innerText="Anruf ablehnen";
        //requestFrame.appendChild(this.decline)

        shadow.appendChild(requestFrame)
    }

    //decline;
    waiting;
    wait;
    accept;
    nameText;
    id = 0;
    name = "unknown";


    setData = function (id, name = "unknown") {
        this.id = id;
        this.name = name;
        this.nameText.innerText = "Name: " + this.name;

        //this.accept.addEventListener("click",()=>{document.getElementsByTagName("ls-videos")[0].call(this.id)})
        this.accept.addEventListener("click", () => { calling(this.id) })
        this.wait.addEventListener("click",()=>{ waitPlease(this.id) })
    }
    getId = function () {
        return this.id;
    }
    getName = function () {
        return this.name;
    }
    setWaiting = function(w){
        if(w){
            this.waiting.innerText="Wartet";
        }else{
            this.waiting.innerText="";
        }
    }
}

class RequestBox extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' })

        let box = document.createElement("div")
        box.style.backgroundColor = "#EEEEEE"
        box.style.minWidth = "100%"
        box.style.minHeight = "210"
        shadow.appendChild(box)

        this.waitlist(box)
    }

    async waitlist(shadow) {
        let wl = (await retrieveWaitlist());

        console.log(wl.waitlist)
        console.log(wl.waitlist.length + " " + shadow.children.length)

        for (let i = 0; i < shadow.children.length; i++) {
            if (!wl.waitlist.includes(shadow.children[i].getId())) {
                shadow.removeChild(shadow.children[i])
            }
        }
        let i = 0
        let sc = shadow.children.length
        while (wl.waitlist.length > shadow.children.length) {
            let req = document.createElement("ls-request")
            req.setData(wl.waitlist[sc+i++])
            shadow.appendChild(req)
        }
        for(let i=0;i<shadow.children.length;i++){
            shadow.children[i].setWaiting(wl.wait[i])
        }

        setTimeout(() => { this.waitlist(shadow) }, 5000)
    }
}

class VideoGrid extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' })

        this.emptyCanvas = document.createElement("canvas")
        this.emptyCanvas.style.width=1;
        this.emptyCanvas.style.height=1;

        let wrapper = document.createElement("span")
        wrapper.style.zIndex=1
        let vg1 = document.createElement("div");
        vg1.style.display = "inline-block"
        let vg2 = document.createElement("div");
        vg2.style.display = "inline-block"
        this.vidme = document.createElement("video")
        this.vidme.autoplay = true;
        this.vidme.width = 200;
        this.vidme.height = 200;
        vg1.style.width=200;
        vg1.style.verticalAlign="top"
        this.vidsup = document.createElement("video")
        this.vidsup.autoplay = true;
        this.vidsup.width = 1600;
        this.vidsup.height = 800;
        let vidsrc = document.createElement("button")
        vidsrc.innerText="Streame Bildschirm"
        vidsrc.addEventListener("click",async ()=>{
            mediaStream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
            this.vidme.srcObject=mediaStream;
            if(conn){
                console.log(conn)
                console.log(conn.peerConnection)
                console.log(conn.peerConnection.getSenders())



                //console.log("TRACKS "+mediaStream.getTracks().length)
                //console.log("TRACKS "+conn.peerConnection.getSenders().length)
                //conn.peerConnection.addTrack(mediaStream.getVideoTracks()[0])
                conn.peerConnection.getSenders()[1].replaceTrack(mediaStream.getVideoTracks()[0])
                console.log(conn.peerConnection.getSenders().length)
                console.log(conn.peerConnection.getSenders()[1].track)
                console.log(conn.peerConnection.getSenders()[0].track.kind+" "+mediaStream.getTracks()[0].kind)


                    /*if(i<conn.peerConnection.getSenders().length){
                        console.log(conn.peerConnection.getSenders()[i].track.kind+" "+mediaStream.getTracks()[i].kind)
                        console.log("i<s")
                        conn.peerConnection.getSenders()[i].replaceTrack(mediaStream.getTracks()[i])
                    }else{
                        console.log("i>s")
                        conn.peerConnection.addTrack(mediaStream.getTracks()[i])
                    }*/

                //conn.peerConnection.getSenders()[1].replaceTrack(mediaStream.getTracks()[1])
            } 
        })
        vg1.appendChild(vidsrc)
        vg1.appendChild(this.vidme)
        vg2.appendChild(this.vidsup)


        wrapper.appendChild(vg1)
        wrapper.appendChild(vg2)
        shadow.appendChild(wrapper)

        shadow.appendChild(this.emptyCanvas)
    }

    vidme;
    vidsup
    emptyCanvas;

    answerCall = function (stream) {
        console.log("ANSWER")
        this.vidsup.srcObject = stream;
    }
    endCall = function (){
        console.log("END CALL")
        this.vidsup.srcObject = new MediaStream();
    }
}

class HelpButton extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' })
        let wrapper = document.createElement("div");
        wrapper.style.zIndex=1
        let btn = document.createElement("button")
        btn.innerText = "Help"
        btn.addEventListener("click", () => {
            if (btn.innerText == "Help") {
                sendIdToServer()
                btn.innerText = "Hang up"
            } else {
                hangup()
                btn.innerText = "Help"
            }
        })
        wrapper.appendChild(btn)
        shadow.appendChild(wrapper)
        //appendChild(document.createElement("button"))
    }
}

class Wait extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' })
        let wrap = document.createElement("span")
        wrap.style.zIndex = 10
        this.waitingLbl = document.createElement("p")
        this.waitingLbl.style.fontWeight = "bold"
        this.waitingLbl.style.color="#FF0055"
        this.waitingLbl.style.fontSize="48px"
        this.waitingLbl.style.position="relative"
        this.waitingLbl.style.transform="translate(-50%, -50%)"
        this.waitingLbl.style.textAlign="center"
        wrap.style.display = "inline-block"
        wrap.style.position="absolute"
        wrap.style.top="50%"
        wrap.style.left="50%"
        //wrap.style.transform="translate(-100%, -100%)"
        wrap.appendChild(this.waitingLbl)
        shadow.appendChild(wrap);
    }

    waitingLbl
    text = "Wir sind gleich für sie da"
    active = false

    setActivation = function (active) {
        console.log("SET ACTIVATION "+active)
        this.active = active
        this.updateLabel();
    }

    dotind = 0

    updateLabel = function () {
        console.log("UPDATE LABEL")
        console.log(this.active)
        this.waitingLbl.innerText = ""
        if (this.active) {
            console.log("ACTIVE");
            this.waitingLbl.innerText = this.text
            for (let i = 0; i < this.dotind; i++) {
                this.waitingLbl.innerText += "."
            }
            this.dotind++;
            if(this.dotind>3){
                this.dotind=0;
            }
        }
    }
}

class Hangup extends HTMLElement{
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' })
        let wrapper = document.createElement("div");
        wrapper.style.zIndex=1
        let btn = document.createElement("button")
        btn.innerText = "Auflegen"
        btn.addEventListener("click", () => {
            hangup()
        })
        wrapper.appendChild(btn)
        shadow.appendChild(wrapper)
        //appendChild(document.createElement("button"))
    }
}

customElements.define('ls-request', Request);
customElements.define('ls-requests', RequestBox);
customElements.define('ls-videos', VideoGrid);
customElements.define('ls-help', HelpButton);
customElements.define('ls-wait', Wait)
customElements.define('ls-hangupbtn',Hangup)