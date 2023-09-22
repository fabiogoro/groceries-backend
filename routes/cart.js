var express = require('express')
var cartDAL = require('../DAL/CartDAL')
var router = express.Router()

router.get('/', async function(req, res) {
  if(req.session.user){
    let cartId = await cartDAL.getCartId(req.session.user)
    if(cartId){
      res.json(await cartDAL.getCart(cartId))
    } else {
      res.json([])
    }
  }
  else {
    res.json([])
  }
})

router.post('/add/:id', async function(req, res) {
  if(req.session.user){
    let cartId = await cartDAL.getCartId(req.session.user)
    if(cartId==undefined){
      cartId = await cartDAL.insertCart(req.session.user)
    }
    let cart = await cartDAL.getCart(cartId)
    let grocery = cart.filter((g)=>g.id==req.params.id)[0]
    if(grocery){
      await cartDAL.updateQuantityGroceryCart({
        cart: grocery.cart_id, 
        grocery: grocery.id, 
        amount: +1
      })
    } else {
      await cartDAL.insertGroceryCart({
        cart: cartId.id, 
        grocery: req.params.id
      })
    }
    cart = await cartDAL.getCart(cartId)
    res.json(cart)
  }
  else {
    res.json({})
  }
})

router.post('/remove/:id', async function(req, res) {
  if(req.session.user){
    let cartId = await cartDAL.getCartId(req.session.user)
    if(cartId==undefined){
      res.json({error: 'Cart is empty'})
      return
    }
    let cart = await cartDAL.getCart(cartId)
    let grocery = cart.filter((g)=>g.id==req.params.id)[0]
    if(grocery.quantity>1){
      await cartDAL.updateQuantityGroceryCart({cart: grocery.cart_id, grocery: grocery.id, amount: -1})
    } else if(grocery.quantity==1) {
      await cartDAL.deleteGroceryCart({cart: grocery.cart_id, grocery: grocery.id})
    }
    cart = await cartDAL.getCart(cartId)
    res.json(cart)
  }
  else {
    res.json({error: 'User must be logged in to request cart info'})
  }
})

module.exports = router
