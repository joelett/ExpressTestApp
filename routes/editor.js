var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('editor.html', { title: 'Game editor' });
});

router.get('/loadData',function(req,res){
    res.send("TEST")
})

router.post('/saveData',function(req,res){
    res.send("done")
})

module.exports = router;
