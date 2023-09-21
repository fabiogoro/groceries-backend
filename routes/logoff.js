var express = require('express')
var router = express.Router()

router.post('/', (req, res) => {
  if (req.session.user) {
    delete req.session.user
    res.json({success: 'User successfully logged off'})
  } else {
    res.json({
      error: 'No user was logged in.',
    })
  }
})

module.exports = router
