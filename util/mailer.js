var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

function sendMail(to, title, text){
  var mailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    subject: title,
    html: text
  }

  transporter.sendMail(mailOptions, function(error){
    if (error) {
      console.log(error)
    }
  })
}


module.exports = sendMail
