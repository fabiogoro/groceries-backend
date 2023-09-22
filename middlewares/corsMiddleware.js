function corsMiddleware(req, res, next) {
  res.append('Access-Control-Allow-Origin', ['http://localhost:3001'])
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.append('Access-Control-Allow-Headers', 'Content-Type')
  res.append('Access-Control-Allow-Credentials', 'true')
  next()
}

module.exports = corsMiddleware
