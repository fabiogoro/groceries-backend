const DAL = require('./DAL')

class CategoryDAL extends DAL{
  async getCategories(){
    return (await this.connection.execute(`SELECT * FROM category`))[0]
  }
}

module.exports = new CategoryDAL()
