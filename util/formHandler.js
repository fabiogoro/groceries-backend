function formHandler(callback, required=[]){
  return async function(req, res, next) {
    for(r of required){
      if(!req.body[r]){
        return res.json({error: `Field ${r} is required.`})
      }
    }
    try{
      return res.json(await req.DAL[callback](req.body))
    } catch(e) {
      return res.json({error: e.sqlMessage})
    }
  }
}

module.exports = formHandler;
