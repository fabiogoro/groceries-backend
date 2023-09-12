var express = require('express');
var router = express.Router();
var userDAL = require('../DAL/UserDAL');

router.post('/', async (req, res) => {
  if (req.session.user) {
    if(req.body.old_password.length!=0 && (await userDAL.getUser({...req.session.user, password: req.body.old_password}))){
      await userDAL.updateUserPassword(req.body.new_password, req.session.user.id)
    } else {
      res.json({
        error: {message: 'Please check you password.', field: 'old_password'},
      });
      return
    }
    await userDAL.updateUserPhone({...req.body, id: req.session.user.id})
    if(!req.body.address_id){
      req.body.address_id = await userDAL.createAddress({...req.body, user_id: req.session.user.id})
    }
    res.json({success: 'Profile successfully updated.', redirect: '/profile'});
  } else {
    res.json({
      error: 'You must be logged in to update your profile.',
    });
  }
});

module.exports = router;
