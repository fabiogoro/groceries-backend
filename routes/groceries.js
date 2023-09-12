var express = require('express');
var groceryDAL = require('../DAL/GroceryDAL');
var router = express.Router();

router.get('/', async function(req, res, next) {
  if(req.query.page && req.query.page<=0){
    res.json({error: 'Page must be 1 or more.'})
    return
  }
  res.json(await groceryDAL.getGroceries(req.query));
});

module.exports = router;
