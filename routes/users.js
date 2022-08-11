var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users.html');
});

router.get('/abfrage', function(req,res){
  res.send({"antwort":"Information"})
})

router.post('/double',function(req,res){
  console.log(req.body)
  res.send({"antwort":""+req.body.test+" | "+req.body.test+""})
})

module.exports = router;
