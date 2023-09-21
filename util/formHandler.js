function formHandler(callback, required=[], customValidation=null){
  return async function(req, res) {
    if(customValidation){
      const error = await customValidation(req)
      if(error) return res.json(error)
    }
    for(const r of required){
      if(!req.body[r]){
        return res.json({error: {field: r, message: `Field ${r} is required.`}})
      }
    }
    try{
      return res.json(await callback(req.body, req.user))
    } catch(e) {
      return res.json({error: e.sqlMessage})
    }
  }
}

module.exports = formHandler
