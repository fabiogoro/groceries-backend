var express = require('express');
var router = express.Router();
var formHandler = require('../util/formHandler')

router.get('/', async function(req, res, next) {
  if(req.session.user){
    res.json(await req.DAL.getUser({email: req.session.user.email}));
  }
  else {
    res.json({})
  }
});

router.post('/', formHandler('createUser', required=['email', 'password']));

module.exports = router;
