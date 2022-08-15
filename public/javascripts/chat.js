

window.addEventListener("DOMContentLoaded",init)

let msgboard, msginput, msgform, uname

function init(){
    msgform=document.getElementById("umsg")
    msginput=document.getElementById("msg")
    msgboard=document.getElementById("messages")
    uname=document.getElementById("uname")

    msgform.addEventListener("submit",sendMessage)

}

function sendMessage(){
    let msg = document.createElement("p")
    msg.textContent=uname.value+"> "+msginput.value
    msgboard.appendChild(msg)

    receiveMessage()
}

function toUnit8(key){
    return Uint8Array.from(window.atob(key),c=>{
        c.charCodeAt(0)
    })
}
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  


async function encryptMessage(key) {
    let enc = new TextEncoder()
    let encoded = enc.encode(msginput.value);
    console.log(typeof str2ab(window.btoa(key)))
    ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      str2ab(window.btoa(key)),
      //toUnit8(btoa(key)),
      //window.btoa(key),
      encoded
    );

    let buffer = new Uint8Array(ciphertext, 0, 5);
    const ciphertextValue = document.querySelector(".rsa-oaep .ciphertext-value");
    ciphertextValue.classList.add('fade-in');
    ciphertextValue.addEventListener('animationend', () => {
      ciphertextValue.classList.remove('fade-in');
    });
    ciphertextValue.textContent = `${buffer}...[${ciphertext.byteLength} bytes total]`;
  }

async function receiveMessage(){
    let servermsg=""
    let sname = ""


    let publicKey= await fetch("/chat/publicKey")

    console.log(
        encryptMessage(publicKey)
    )

    let resp=await(await fetch("chat/message",{
        method:"POST",
                    headers:{'Content-Type': 'application/json'},
                    body:await JSON.stringify({
                        message:JSON.stringify(encryptMessage(publicKey)),
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