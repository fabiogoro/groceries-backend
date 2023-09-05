var express = require('express');
var router = express.Router();
var formHandler = require('../util/formHandler')

router.get('/', async function(req, res, next) {
  if(req.session.user){
    res.json({})
    res.json(await req.DAL.getUser({email: req.session.user.email}));
  }
  else {
    res.json({})
  }
});

router.post('/', async (req, res) => {
  if (req.session.user) {
    if(!req.body.address_id){
      req.body.address_id = await req.DAL.createAddress({...req.body, user_id: req.session.user.id})
    }
    const cartId = await req.DAL.getCartId(req.session.user)
    if(cartId) {
      const cart = await req.DAL.getCart(cartId)
      req.DAL.createOrder({...req.body, cart: cart, user_id: req.session.user.id})
      res.json({});
    } else {
      res.json({
        error: 'You must add products to the cart before placing an order.',
      });
    }
  } else {
    res.json({
      error: 'You must be logged in to create order.',
    });
  }
});

module.exports = router;
