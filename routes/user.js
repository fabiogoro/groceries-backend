var express = require('express');
var router = express.Router();
var formHandler = require('../util/formHandler')

router.get('/', async function(req, res, next) {
  if(req.session.user){
    res.json(req.session.user);
  }
  else {
    res.json({})
  }
});

router.post('/', formHandler('createUser', required=['email', 'password']));

module.exports = router;
