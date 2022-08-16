

window.addEventListener("DOMContentLoaded",init)

let msgboard, msginput, msgform, uname

function init(){
    //showChatWindow()

    showLogin()

    //msgform=document.getElementById("umsg")
    //msginput=document.getElementById("msg")
    //msgboard=document.getElementById("messages")
    //uname=document.getElementById("uname")

    //msgform.addEventListener("submit",sendMessage)

}

function sendMessage(){
    let msg = document.createElement("p")
    msg.textContent=uname+"> "+msginput.value
    msgboard.appendChild(msg)

    receiveMessage()
}



async function receiveMessage(){
    let servermsg=""
    let sname = ""


    let resp=await(await fetch("chat/message",{
        method:"POST",
                    headers:{'Content-Type': 'application/json'},
                    body:await JSON.stringify({
                        message:msginput.value,
                        uname:uname.value
                    })
    })).json()
    servermsg+=resp.msg
    sname=resp.name
    
    let msg = document.createElement("p")
    msg.style.textAlign="end"
    msg.textContent=servermsg+" <"+sname
    msgboard.appendChild(msg)

    msginput.value=""
}


async function showLogin(){
    document.getElementById('login').innerHTML= `
<div style="background-color:#AAAAAA55; width:400; height:150" >
    <h3 align="center">Login</h3>
    <form id="logform" onsubmit="return false;">
    <label for="uname" >    user: </label>
    <input type="text" id="uname"><br>
    <label for="pass" >password: </label>
    <input type="password" id="pass">
    <input type="submit" id="loginsubmit">
</form>
<p id="response" style="color:red"></p>
</div>
`
document.getElementById('loginsubmit').addEventListener("click",login)
console.log("Showlogin");
}

let publicKey
async function login(){
    publicKey = (await(await fetch("chat/getPubKey")).json()).public
    
    
    //console.log(await crypto.subtle.encrypt("RSA-OAEP",publicKey,"Hello World"))
    let pk = str2ab(window.atob(publicKey.replace("-----BEGIN PUBLIC KEY-----\n","").replace("-----END PUBLIC KEY-----\n","")))
    
    let crypt = await crypto.subtle.importKey("spki",
    pk,
    {
        name: "RSA-OAEP",
        hash: "SHA-256",
    },
    true,
    ["encrypt"])


    console.log(btoa(ab2str(await crypto.subtle.encrypt("RSA-OAEP",crypt,str2ab(document.getElementById("pass").value)))))




    console.log("LOGIN");
    let data = await (await fetch("chat/login",{
        method:"POST",
                    headers:{'Content-Type': 'application/json'},
                    body: await JSON.stringify({
                        uname:document.getElementById("uname").value,
                        pass:btoa(ab2str(await crypto.subtle.encrypt("RSA-OAEP",crypt,str2ab(document.getElementById("pass").value))))
                    })
    })).json()
    console.log(data);
    if(data.reload){
        location.reload()
    }
    document.getElementById("response").textContent=data.smsg

    if(data.html){
        showChatWindow(data.html)
        uname=document.getElementById("uname").value
        document.getElementById("login").remove()
    }
}


////////////////////////////////////////

function getSpkiDer(spkiPem){
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    var pemContents = spkiPem.substring(pemHeader.length, spkiPem.length - pemFooter.length);
    var binaryDerString = window.atob(pemContents);
    return str2ab(binaryDerString); 
}

//
// Helper
//

// https://stackoverflow.com/a/11058858
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
    
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

//////////////////////////////////////////////////




function showChatWindow(html){
    document.getElementById('chat').innerHTML= html

    msgform=document.getElementById("umsg")
    msginput=document.getElementById("msg")
    msgboard=document.getElementById("messages")
    //uname=document.getElementById("uname")

    msgform.addEventListener("submit",sendMessage)
/*
<div>
        <div id="messages" class="msg">
            <p>Messages will appear here:</p>
        </div>
        <form id="umsg" onsubmit="return false;">
            <input type="text" class="msg" id="msg">
            <input type="submit">
        </form>
        </div>
*/
}