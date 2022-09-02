window.addEventListener("DOMContentLoaded",init)

async function init(){
    document.getElementById("testform").onsubmit=()=>{return false;}
    document.getElementById("submitbtn").addEventListener("click",async ()=>{
        //encryptData(document.getElementById("input").value,pemEncodedKey)
        console.log("====")
        console.log("ENCRYPT")
        let encry = await encryptData(document.getElementById("input").value,pemEncodedKey)
        let encry_str = window.btoa(ab2str(encry))
        console.log("Encrypted "+document.getElementById("input").value);
        console.log(encry_str)


        console.log("DECRYPT")
        let enc = str2ab(window.atob(encry_str))
        console.log(enc)

        let decry = await decryptData(enc,privKey)
        let decry_str = ab2str(decry)
        console.log("Decrypted")
        console.log(decry_str)
        console.log("====")


        console.log("SERVER DECRYPT")
        console.log(await(await fetch("/crypto/decrypt",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:await JSON.stringify({
                str:encry_str
            })
        })).json())

    })
}

/*const pemEncodedKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy3Xo3U13dc+xojwQYWoJLCbOQ5fOVY8LlnqcJm1W1BFtxIhOAJWohiHuIRMctv7dzx47TLlmARSKvTRjd0dF92jx/xY20Lz+DXp8YL5yUWAFgA3XkO3LSJgEOex10NB8jfkmgSb7QIudTVvbbUDfd5fwIBmCtaCwWx7NyeWWDb7A9cFxj7EjRdrDaK3ux/ToMLHFXVLqSL341TkCf4ZQoz96RFPUGPPLOfvN0x66CM1PQCkdhzjE6U5XGE964ZkkYUPPsy6Dcie4obhW4vDjgUmLzv0z7UD010RLIneUgDE2FqBfY/C+uWigNPBPkkQ+Bv/UigS6dHqTCVeD5wgyBQIDAQAB
-----END PUBLIC KEY-----`;*/
const pemEncodedKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3538eB94Q9BFrO+pBDSb4t13N9uiLctAg0wF6y0hhsPxKrILQOcokl9vJStXX6Hi/eCtKYDILNpYbvwIEuvHTQuURE1qHYtPMDWli8DE0SganTSap5VCvk1KyH3lDyZNdl6KCHusEFqPgF/q/OBG0BWxdr92TWNCKZ9lg5oHc6QIDAQAB`

const privKey = `MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALfnfx4H3hD0EWs76kENJvi3Xc326Ity0CDTAXrLSGGw/EqsgtA5yiSX28lK1dfoeL94K0pgMgs2lhu/AgS68dNC5RETWodi08wNaWLwMTRKBqdNJqnlUK+TUrIfeUPJk12XooIe6wQWo+AX+r84EbQFbF2v3ZNY0Ipn2WDmgdzpAgMBAAECgYARIZ6E1KTKHYJV4/Hxd2EvAB3b5ulIvDxJIn7byn4Go68M4b8Z2JhNClxuBuuevkgpRe96cTWYN9CJ6yQr/qIyLGf9ur5RNJjwxIaCRWZe8HzwLq6mH0gswS/AJHhxNGVfhKojV5iwP4BqoEMPrXTQv4So7u1Xh7uarXnZTNlgpQJBAOUYGbCZ6kUhVOLafGkddgACcqiNnGNiVwpNOG/6jdKId9F91axfVnffHACMSn1bpmsmWcl5MTvtS+I9eYfs1yMCQQDNgLoMlBVMkmnan2N9yHWq2DCiIYKrucKxrNDFUUTrvQgoR9Akt4vl8VXSVtmukmbSXM7J0wZcU5CqPHlZsIKDAkAhjgEdQ73zeClVvMiiIMWKxNEEbRFt4RZ8lMjiZeFl58Uc8wBb6e7hSdVxIxs59zWN1iUqhEy4yU3nCjgFt6PfAkAudH4aX9NcxvBU8pkMEye+YjbEP+0JIuoHPjjHkjKRU98nM+yykCd46JBtByMYWpIR1dcNOr4CWwWl5hvMkaE/AkBz6zPH3ZdwD/WcNuODwgLDVv5BBHTN5Ig1o6sV1XFsUvu4GXZN6TAYTlWQVHkPLTpEK3n6DDMLgJzt3g6VEX5y`

function importRsaKey(pem) {
    // fetch the part of the PEM string between header and footer
    //const pemHeader = "-----BEGIN PUBLIC KEY-----";
    //const pemFooter = "-----END PUBLIC KEY-----";
    //const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    const pemContents = pem
    console.log(pemContents)
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    console.log(binaryDerString)
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);
    console.log(binaryDer)

    return window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["encrypt"]
    );
  }

  function importPrivateKey(pem) {
    // fetch the part of the PEM string between header and footer
    //const pemHeader = "-----BEGIN PRIVATE KEY-----";
    //const pemFooter = "-----END PRIVATE KEY-----";
    //const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    const pemContents = pem;
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);
  
    return window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );
  }

async function encryptData(data, pubkey){
    let pub = await importRsaKey(pubkey)
    console.log("PUB")
    console.log(pub)
    console.log("PUB END")

    let enc = new TextEncoder();
    //return "Test";
    return await window.crypto.subtle.encrypt("RSA-OAEP",pub,enc.encode(data))
}

async function decryptData(data,privKey){
    let priv = await importPrivateKey(privKey)
    console.log("PRIV")
    console.log(priv)
    console.log("PRIV END")

    return await window.crypto.subtle.decrypt("RSA-OAEP",priv,data)
}


function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
  
  function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

