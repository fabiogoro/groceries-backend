var express = require('express');
var router = express.Router();

router.get('/:id', async function(req, res, next) {
  res.json(await req.DAL.getGrocery(req.params.id));
});

module.exports = router;
