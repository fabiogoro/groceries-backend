var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  if(!req.body.name){
    res.status(400).redirect('/contact')
  }
  if(!req.body.email){
    res.status(400).redirect('/contact')
  }
  res.send('respond with a resource');
});

module.exports = router;
