var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
  res.json(await req.DAL.getCategories());
});

module.exports = router;
