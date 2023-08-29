
class User{
  constructor({id, name, email, password}){
    if(id){
      res.json(queryResults[0]);
      const queryResults = await req.connection.execute(`SELECT * FROM user`)
    }
  }
}



module.exports = User;
