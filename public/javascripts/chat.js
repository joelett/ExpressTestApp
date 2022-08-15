

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

async function login(){
    console.log("LOGIN");
    let data = await (await fetch("chat/login",{
        method:"POST",
                    headers:{'Content-Type': 'application/json'},
                    body: await JSON.stringify({
                        uname:document.getElementById("uname").value,
                        pass:document.getElementById("pass").value
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