const mysql = require('mysql2/promise')
const encrypt = require('../util/encrypt')

class DAL{
  constructor(){
    this.connect()
  }

  async getUsers(){
    return (await this.connection.execute(`SELECT * FROM user`))[0]
  }

  async getGroceries({sort_by, categories}){
    return (await this.connection.execute(`SELECT *, (select path from grocery_picture where grocery=grocery.id limit 1) thumbnail FROM grocery ${categories?`where category in (${categories})`:''} ORDER BY ${sort_by.replace('.',' ')}`))[0]
  }

  async getGrocery(id){
    const res = (await this.connection.execute(`SELECT *, (select name from category where category.id=category) category_name FROM grocery where id=${id}`))[0][0]
    res.pictures = (await this.connection.execute(`select path from grocery_picture where grocery=${id}`))[0]
    return res
  }

  async getCategories(){
    return (await this.connection.execute(`SELECT * FROM category`))[0]
  }

  async getUser({email, password}){
    return (await this.connection.execute(`SELECT * FROM user where email='${email}' and password='${encrypt(password)}'`))[0][0]
  }

  async getUserByEmail({email}){
    return (await this.connection.execute(`SELECT * FROM user where email='${email}'`))[0][0]
  }

  async updateUserPassword(password, id){
    return (await this.connection.execute(`UPDATE user set password='${encrypt(password)}' where id='${id}'`))[0][0]
  }

  async createUser({name, email, password, phone}){
    return await this.connection.execute(`INSERT user (email, name, phone, password) values('${email}', '${name}', '${phone}', '${encrypt(password)}')`)
  }

  async connect(){
    this.connection = await mysql.createConnection({
      host: 'localhost',
      user: 'groceries',
      database: 'groceries',
      password: process.env.DB_PASS
    })
  }
}

module.exports = new DAL();
