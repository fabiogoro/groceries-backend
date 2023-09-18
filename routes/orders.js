var express = require('express');
var router = express.Router();
var orderDAL = require('../DAL/OrderDAL');
var userDAL = require('../DAL/UserDAL');
var cartDAL = require('../DAL/CartDAL');

router.get('/', async function(req, res, next) {
  if(req.query.page && req.query.page<=0){
    res.json({error: 'Page must be 1 or more.'})
    return
  }
  if(req.session.user && req.session.user.is_admin){
    const response = await orderDAL.getOrders({...req.query})
    res.json(response);
  } else {
    res.json([])
  }
});

router.get('/my', async function(req, res, next) {
  if(req.query.page && req.query.page<=0){
    res.json({error: 'Page must be 1 or more.'})
    return
  }
  if(req.session.user){
    const response = await orderDAL.getOrdersFromUser({...req.query, user: req.session.user.id})
    res.json(response);
  } else {
    res.json([])
  }
});

module.exports = router;
