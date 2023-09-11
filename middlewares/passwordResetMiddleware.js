var passwordResetHelper = require('../util/passwordResetHelper')

function passwordResetMiddleware(req, res, next){
  req.passwordResetHelper = passwordResetHelper
  next()
}

module.exports = passwordResetMiddleware
