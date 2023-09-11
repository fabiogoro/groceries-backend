var express = require('express');
var userDAL = require('../DAL/UserDAL');
var router = express.Router();

router.post('/', async (req, res) => {
  const user = await userDAL.getUser(req.body)

  if (user) {
    req.session.user = user
    res.json({success: 'User successfully authenticated', redirect: '/'});
  } else {
    res.json({
      error: 'Invalid email or password',
    });
  }
});

module.exports = router
