const DAL = require('./DAL')

class CategoryDAL extends DAL{
  async getCategories(){
    return (await this.connection.execute(`
      SELECT * FROM category_tree order by name asc
    `))[0]
  }
}

module.exports = new CategoryDAL()
