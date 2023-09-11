const DAL = require('./DAL')

class GroceryDAL extends DAL{
  async getGroceries({sort_by, categories, q, page}){
    return (await this.connection.execute(`SELECT *, (select path from grocery_picture where grocery=grocery.id limit 1) thumbnail FROM grocery where title like '%${q}%' ${categories?` and category in (${categories})`:''} ORDER BY ${sort_by.replace('.',' ')} LIMIT ${(page-1)*20},${page*20}`))[0]
  }

  async getGrocery(id){
    const res = (await this.connection.execute(`SELECT *, (select name from category where category.id=category) category_name FROM grocery where id=${id}`))[0][0]
    res.pictures = (await this.connection.execute(`select path from grocery_picture where grocery=${id}`))[0]
    return res
  }
}

module.exports = new GroceryDAL()
