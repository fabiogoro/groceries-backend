const crypto = require('crypto');

class PasswordResetHelper{
  constructor(){
    this.passwordResetTokens = {}
  }

  generateToken(){
    return crypto.randomBytes(30).toString('hex');
  }

  registerPasswordReset(user){
    const authToken = this.generateToken();
    this.passwordResetTokens[authToken] = {user, timestamp: Date.now()};
    return authToken
  }

  consumePasswordResetToken(token){
    const data = this.passwordResetTokens[token];
    if(!data){
      return
    }
    if(data.timestamp < Date.now()-15*60*1000){
      delete this.passwordResetTokens[token]
    } else if(data.user){
      delete this.passwordResetTokens[token]
      return data.user
    }
  }
}



module.exports = new PasswordResetHelper()
