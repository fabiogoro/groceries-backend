var express = require('express');
var router = express.Router();
var userDAL = require('../DAL/UserDAL');

router.get('/', async function(req, res, next) {
  res.json(await userDAL.getUsers());
});

module.exports = router;
