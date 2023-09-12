const DAL = require('./DAL')

class GroceryDAL extends DAL{
  async getGroceries({sort_by, categories, q, page}){
    const results = (await this.connection.execute(`SELECT *, (select path from grocery_picture where grocery=grocery.id limit 1) thumbnail, (select name from category where category=category.id) category_name FROM grocery where title like '%${q}%' ${categories?` and category in (${categories})`:''} ORDER BY ${sort_by.replace('.',' ')} LIMIT ${(page-1)*20},${page*20}`))[0]
    const pages = (await this.connection.execute(`SELECT ceil(count(id)/20) pages FROM grocery where title like '%${q}%' ${categories?` and category in (${categories})`:''}`))[0][0]
    return {...pages, results}
  }

  async getGrocery(id){
    const res = (await this.connection.execute(`SELECT *, (select name from category where category.id=category) category_name FROM grocery where id=${id}`))[0][0]
    res.pictures = (await this.connection.execute(`select path from grocery_picture where grocery=${id}`))[0]
    return res
  }
}

module.exports = new GroceryDAL()
