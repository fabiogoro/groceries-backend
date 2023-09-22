var express = require('express')
var categoryDAL = require('../DAL/CategoryDAL')
var router = express.Router()

router.get('/', async function(req, res) {
  res.json(await categoryDAL.getCategories())
})

module.exports = router
