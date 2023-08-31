var express = require('express');
var router = express.Router();

router.post('/', async (req, res) => {
  const user = await req.DAL.getUser(req.body)

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
