var express = require('express');
var sendMail = require('../util/mailer');
var userDAL = require('../DAL/UserDAL');
var router = express.Router();

router.post('/', async (req, res) => {
  const user = await userDAL.getUserByEmail(req.body)

  if (user) {
    const authToken = req.passwordResetHelper.registerPasswordReset(user)
    sendMail(user.email, 'Password reset request', `
    <h1>Password reset request</h1>
    <p>Hello, ${user.name}.</p>
    <p>We have received your request for a new password. To create the new password, please follow the link bellow.</p>
    <p><a href="${process.env.FRONTEND_BASE_URL}/password?token=${authToken}">Click here to create a new password.</a></p>
    <p>Regards,</p>
    <p>Groceries store team</p>
    `)
    res.json({success: 'You will receive an email with further instructions.'});
  } else {
    res.json({
      error: {field: 'email', message: 'Invalid email',}
    });
  }
});

router.post('/password', async (req, res) => {
  const user = req.passwordResetHelper.consumePasswordResetToken(req.body.token)
  if(user){
    userDAL.updateUserPassword(req.body.password, user.id)
    res.json({success: 'Password successfully updated.'})
  }else{
    res.json({error: 'Invalid token.'})
  }
});

module.exports = router
