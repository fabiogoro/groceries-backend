var express = require('express');
var router = express.Router();
var userDAL = require('../DAL/UserDAL');
var formHandler = require('../util/formHandler')

router.get('/', async function(req, res, next) {
  if(req.session.user){
    res.json(await userDAL.getUser({email: req.session.user.email}));
  }
  else {
    res.json({})
  }
});

async function signUpValidations(req){
  const user = await userDAL.getUserByEmail(req.body)
  if(user) return {
    error: 
    {
      field: 'email', 
      message: `The email '${req.body.email}' is already signed up.`
    },
  }
}

router.post('/', formHandler(userDAL.createUser.bind(userDAL), required=['email', 'password', 'name'], signUpValidations));

module.exports = router;
