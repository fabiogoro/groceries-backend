const crypto = require('crypto')

function encrypt(val){
  const sha256 = crypto.createHash('sha256')
  return sha256.update(val).digest('base64')
}

module.exports = encrypt
