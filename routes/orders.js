var express = require('express');
var router = express.Router();
var orderDAL = require('../DAL/OrderDAL');
var userDAL = require('../DAL/UserDAL');
var cartDAL = require('../DAL/CartDAL');

router.get('/', async function(req, res, next) {
  if(req.session.user){
    const response = await orderDAL.getOrders({user: req.session.user.id})
    res.json(response);
  } else {
    res.json([])
  }
});

module.exports = router;
