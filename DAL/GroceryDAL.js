const DAL = require('./DAL')

class GroceryDAL extends DAL{
  async getGroceries({sort_by, categories, q, page}){
    const results = (await this.connection.execute(`
      SELECT *, 
        (select path from grocery_picture where grocery=grocery.id limit 1) thumbnail, 
        (select name from category where category=category.id) category_name 
      FROM grocery 
      WHERE 
        title LIKE '%${q}%' 
        ${categories?` 
          AND category IN (${categories})
          `:''} 
      ORDER BY ${sort_by.replace('.',' ')} 
      LIMIT ${(page-1)*20},${page*20}
    `))[0]
    const pages = (await this.connection.execute(`
      SELECT ceil(count(id)/20) pages 
      FROM grocery 
      WHERE 
        title LIKE '%${q}%' 
        ${categories?` 
          AND category in (${categories})
          `:''}
    `))[0][0]
    return {...pages, results}
  }

  async getGrocery(id){
    const res = (await this.connection.execute(`
      SELECT *, 
        (select category_sequence from category_name_tree where category_name_tree.id=category) category_name 
      FROM grocery 
      WHERE id=${id}
    `))[0][0]
    res.pictures = (await this.connection.execute(`select path from grocery_picture where grocery=${id}`))[0]
    return res
  }

  async createGrocery({title, 
                        description, 
                        price, 
                        category,
                        image, id, fats, proteins, carbohydrates, calories}){
    if(id){
      return await this.updateGrocery({title, 
                        description, 
                        price, 
                        category,
                        image, id, fats, proteins, carbohydrates, calories})
    }
    const response = await this.connection.execute(`
          INSERT grocery (
                        title, 
                        description, 
                        price, 
                        calories, 
                        proteins, 
                        carbohydrates, 
                        fats, 
                        category
                      ) 
               values (
                        ${this.escape(title)}, 
                        ${this.escape(description)}, 
                        ${this.escape(price)}, 
                        ${this.escape(calories)}, 
                        ${this.escape(proteins)}, 
                        ${this.escape(carbohydrates)}, 
                        ${this.escape(fats)}, 
                        ${this.escape(category)}
                      )
        `)
    const response2 = await this.connection.execute(`
          INSERT grocery_picture (
                        grocery, 
                        path
                      ) 
               values (
                        ${response[0].insertId}, 
                        ${this.escape(image)}
                      )
        `)
    return response2
  }

  async updateGrocery({title, 
                        description, 
                        price, 
                        category,
                        image, id, fats, proteins, carbohydrates, calories}){
    const response = await this.connection.execute(`
          UPDATE grocery SET 
                        title=${this.escape(title)}, 
                        description=${this.escape(description)}, 
                        price=${this.escape(price)}, 
                        calories=${this.escape(calories)}, 
                        proteins=${this.escape(proteins)}, 
                        carbohydrates=${this.escape(carbohydrates)}, 
                        fats=${this.escape(fats)}, 
                        category=${this.escape(category)}
          WHERE id=${id}
        `)
    const response2 = await this.connection.execute(`
          UPDATE grocery_picture 
          SET path=${this.escape(image)}
          WHERE grocery=${id}
        `)
    return response2
  }
}

module.exports = new GroceryDAL()
