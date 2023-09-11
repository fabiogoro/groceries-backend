var express = require('express');
var groceryDAL = require('../DAL/GroceryDAL');
var router = express.Router();

router.get('/:id', async function(req, res, next) {
  res.json(await groceryDAL.getGrocery(req.params.id));
});

module.exports = router;
