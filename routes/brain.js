let express = require('express');
let router = express.Router();
let brain = require("brain.js")
let TrainStream = require("train-stream")
var ccxt = require("ccxt")

console.log(ccxt.exchanges)
//4M445DC4VRBGU6OK ALPHA VATAGE


/*let net = new brain.NeuralNetwork()
let url = ""

function readInputs(stream,data){
    for(let i=0;i<data.length;i++){
        stream.write(data[i]);
    }
    stream.endInputs();
}

let trainingStream = new TrainStream({
    neuralNetwork:net,

    floodCallback: async function(){
        readInputs(trainingStream,await fetch(url))
    }
})*/





router.get("/", (req, res) => {
    res.render("brain.html")
});


module.exports = router;