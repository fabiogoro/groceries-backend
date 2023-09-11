var express = require('express');
var groceryDAL = require('../DAL/GroceryDAL');
var router = express.Router();

router.get('/', async function(req, res, next) {
  res.json(await groceryDAL.getGroceries(req.query));
});

module.exports = router;
