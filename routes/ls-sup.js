let express = require('express');
let router = express.Router();

let {PeerServer} = require("peer")
let peerServer = PeerServer({port:9000,path:'/support'})

router.get("/", (req, res) => {
    res.render("ls-sup.html")
});

router.get("/sup",(req,res)=>{
    res.render("ls-super.html")
})


let waitlist = []
let waiting = []
let stayAlive = []

router.post("/addToWaitlist",(req,res)=>{
    if(!waitlist.includes(req.body.id)){
        console.log("ADD "+req.body.id)
        waitlist.push(req.body.id)
        stayAlive.push(true)
        waiting.push(false);
    }
    res.status(200).send("OK");
})

router.post("/stillAlive",(req,res)=>{
    console.log("ALIVE")
    if(waitlist.includes(req.body.id)){
        let i = waitlist.indexOf(req.body.id)
        console.log(waiting)
        stayAlive[i]=true;
        res.status(200).send(JSON.stringify({
            wait:waiting[i]
        }))
    }else{
        res.status(404).send("USER NOT FOUND")
    }
})

router.post("/waitForMe",(req,res)=>{
    if(waitlist.includes(req.body.id)){
        console.log("PLEASE WAIT "+req.body.id+" "+req.body.wait)
        let i = waitlist.indexOf(req.body.id)
        waiting[i]=req.body.wait;
        res.status(200).send("Ok!")
    }else{
        res.status(404).send("USER NOT FOUND")
    }
})

router.get("/getWaitlist",(req,res)=>{
    res.status(200).send(JSON.stringify({waitlist:waitlist,wait:waiting}));
})

router.post("/remWaitlist",(req,res)=>{
    console.log("Is in waitlist? "+waitlist.includes(req.body.id))
    if(waitlist.includes(req.body.id)){
        let i = waitlist.indexOf(req.body.id)
        console.log("REMOVE "+req.body.id)
        waitlist.splice(i,1)
        stayAlive.splice(i,1)
        waiting.splice(i,1)
    }
    res.status(200).send("OK");
})

async function removeDeadElements(){
    console.log("Rem")
    for(let i = waitlist.length-1;i>=0;i--){
        if(!stayAlive[i]){
            console.log("REMOVE "+waitlist[i])
            waitlist.splice(i,1)
            stayAlive.splice(i,1)
            waiting.splice(i,1)
        }else{
            console.log("REMOVE NEXT TIME")
            stayAlive[i]=false
        }
    }
    setTimeout(removeDeadElements,5000)
}
removeDeadElements()



module.exports = router;