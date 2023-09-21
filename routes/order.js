var express = require('express')
var router = express.Router()
var orderDAL = require('../DAL/OrderDAL')
var userDAL = require('../DAL/UserDAL')
var cartDAL = require('../DAL/CartDAL')

router.get('/:id', async function(req, res) {
  if(req.session.user){
    const response = await orderDAL.getOrder({id: req.params.id, user: req.session.user})
    res.json(response)
  } else {
    res.json({})
  }
})

router.post('/', async (req, res) => {
  if (req.session.user) {
    if(!req.body.address_id){
      req.body.address_id = await userDAL.createAddress({...req.body, user_id: req.session.user.id})
    }
    const cartId = await cartDAL.getCartId(req.session.user)
    if(cartId) {
      const cart = await cartDAL.getCart(cartId)
      const order = await orderDAL.createOrder({...req.body, cart: cart, user_id: req.session.user.id})
      res.json({success: 'Thanks for purchasing with us. We will be in touch soon about your order. Here is your receipt.', redirect: `/order/${order}?message=${'Thanks for purchasing with us. We will be in touch soon about your order. Here is your receipt.'}`})
    } else {
      res.json({
        error: 'You must add products to the cart before placing an order.',
      })
    }
  } else {
    res.json({
      error: 'You must be logged in to create order.',
    })
  }
})

module.exports = router
