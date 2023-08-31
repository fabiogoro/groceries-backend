var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
  if(req.session.user){
    let cartId = await req.DAL.getCartId(req.session.user)
    if(cartId){
      res.json(await req.DAL.getCart(cartId));
    } else {
      res.json([])
    }
  }
  else {
    res.json([])
  }
});

router.post('/add/:id', async function(req, res, next) {
  if(req.session.user){
    let cartId = await req.DAL.getCartId(req.session.user)
    if(cartId==undefined){
      let cart = await req.DAL.insertCart(req.session.user)
      let cartId = await req.DAL.getCartId(req.session.user)
    }
    let cart = await req.DAL.getCart(cartId)
    let grocery = cart.filter((g)=>g.id==req.params.id)[0]
    if(grocery){
      await req.DAL.updateQuantityGroceryCart({cart: grocery.cart_id, grocery: grocery.id, amount: +1})
    } else {
      await req.DAL.insertGroceryCart({cart: cartId.id, grocery: req.params.id})
    }
    cart = await req.DAL.getCart(cartId)
    res.json(cart);
  }
  else {
    res.json({})
  }
});

router.post('/remove/:id', async function(req, res, next) {
  if(req.session.user){
    let cartId = await req.DAL.getCartId(req.session.user)
    let cart = await req.DAL.getCart(cartId)
    let grocery = cart.filter((g)=>g.id==req.params.id)[0]
    if(grocery.quantity>1){
      await req.DAL.updateQuantityGroceryCart({cart: grocery.cart_id, grocery: grocery.id, amount: -1})
    } else {
      await req.DAL.deleteGroceryCart({cart: grocery.cart_id, grocery: grocery.id})
    }
    cart = await req.DAL.getCart(cartId)
    res.json(cart);
  }
  else {
    res.json({error: 'User must be logged in to request cart info'});
  }
});

module.exports = router;
