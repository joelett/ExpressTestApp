let express = require('express');
let router = express.Router();

const crypto = require('crypto');

router.get("/", (req, res) => {
    console.log("TEST")
    res.render("crypto.html")
});

const pemEncodedKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3538eB94Q9BFrO+pBDSb4t13N9uiLctAg0wF6y0hhsPxKrILQOcokl9vJStXX6Hi/eCtKYDILNpYbvwIEuvHTQuURE1qHYtPMDWli8DE0SganTSap5VCvk1KyH3lDyZNdl6KCHusEFqPgF/q/OBG0BWxdr92TWNCKZ9lg5oHc6QIDAQAB`

const privKey = `-----BEGIN PRIVATE KEY-----
MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALfnfx4H3hD0EWs76kENJvi3Xc326Ity0CDTAXrLSGGw/EqsgtA5yiSX28lK1dfoeL94K0pgMgs2lhu/AgS68dNC5RETWodi08wNaWLwMTRKBqdNJqnlUK+TUrIfeUPJk12XooIe6wQWo+AX+r84EbQFbF2v3ZNY0Ipn2WDmgdzpAgMBAAECgYARIZ6E1KTKHYJV4/Hxd2EvAB3b5ulIvDxJIn7byn4Go68M4b8Z2JhNClxuBuuevkgpRe96cTWYN9CJ6yQr/qIyLGf9ur5RNJjwxIaCRWZe8HzwLq6mH0gswS/AJHhxNGVfhKojV5iwP4BqoEMPrXTQv4So7u1Xh7uarXnZTNlgpQJBAOUYGbCZ6kUhVOLafGkddgACcqiNnGNiVwpNOG/6jdKId9F91axfVnffHACMSn1bpmsmWcl5MTvtS+I9eYfs1yMCQQDNgLoMlBVMkmnan2N9yHWq2DCiIYKrucKxrNDFUUTrvQgoR9Akt4vl8VXSVtmukmbSXM7J0wZcU5CqPHlZsIKDAkAhjgEdQ73zeClVvMiiIMWKxNEEbRFt4RZ8lMjiZeFl58Uc8wBb6e7hSdVxIxs59zWN1iUqhEy4yU3nCjgFt6PfAkAudH4aX9NcxvBU8pkMEye+YjbEP+0JIuoHPjjHkjKRU98nM+yykCd46JBtByMYWpIR1dcNOr4CWwWl5hvMkaE/AkBz6zPH3ZdwD/WcNuODwgLDVv5BBHTN5Ig1o6sV1XFsUvu4GXZN6TAYTlWQVHkPLTpEK3n6DDMLgJzt3g6VEX5y
-----END PRIVATE KEY-----`

router.post("/decrypt",async (req,res)=>{
    console.log("DECRYPTING")
    
    let encry_str = req.body.str;
    console.log(encry_str)
    let encry = Buffer.from(encry_str,"base64")
    console.log(encry)

    let decry = await decryptData(encry,privKey)
    //let decry_str = ab2str(decry)
    console.log("Decrypted")
    console.log(decry)


    res.send(JSON.stringify({str:decry}))
})

async function decryptData(data,privKey){
    let priv = await importPrivateKey(privKey)
    
    return await crypto.privateDecrypt(priv,data)
}

function importPrivateKey(pem) {
  
    /*return crypto.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );*/
    return crypto.createPrivateKey({
        'key': pem,
        'format': 'pem',
        'type':'pkcs8',
        'cipher':'RSA-OAEP',
        'hash':'SHA-256'
    })
}

//function atob(str){
//    return Buffer.from(str, 'utf8').toString('base64');
//}
//function btoa(str){
//    return Buffer.from(str, 'base64').toString('utf8');
//}
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

module.exports = router;