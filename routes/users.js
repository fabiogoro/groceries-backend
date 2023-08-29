var express = require('express');
var router = express.Router();
var formHandler = require('../util/formHandler')

router.get('/', async function(req, res, next) {
  res.json(await req.DAL.getUsers());
});

router.post('/', formHandler('createUser', required=['email', 'password']));

module.exports = router;
