var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('editor.html', { title: 'Game editor' });
});

router.get('/loadData',function(req,res){  
  console.log("Loading Data")
  let directory = "../public/game/worlds/"
  console.log(" file: "+__dirname+"/"+directory+req.headers.gamefile+" existing? "+fs.existsSync(__dirname+"/"+directory+req.headers.gamefile))
    if(fs.existsSync(__dirname+"/"+directory+req.headers.gamefile)){  
      res.send(JSON.parse(fs.readFileSync(__dirname+"/"+directory+req.headers.gamefile)))
    }else{
      res.status(404)
      res.send("File not found")
    }
})

router.post('/saveData',function(req,res){
    
  
  res.send("done")
})

module.exports = router;
