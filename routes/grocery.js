var express = require('express');
var groceryDAL = require('../DAL/GroceryDAL');
var formHandler = require('../util/formHandler');
var router = express.Router();

router.get('/:id', async function(req, res, next) {
  res.json(await groceryDAL.getGrocery(req.params.id));
});

router.post('/', formHandler(groceryDAL.createGrocery.bind(groceryDAL), required=['title', 'description', 'price', 'image', 'category']));

module.exports = router;
