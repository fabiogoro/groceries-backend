const mysql = require('mysql2/promise')
const encrypt = require('../util/encrypt')

class DAL{
  constructor(){
    this.connect()
  }

  async getUsers(){
    return (await this.connection.execute(`SELECT * FROM user`))[0]
  }

  async getGroceries({sort_by, categories, q, page}){
    return (await this.connection.execute(`SELECT *, (select path from grocery_picture where grocery=grocery.id limit 1) thumbnail FROM grocery where title like '%${q}%' ${categories?` and category in (${categories})`:''} ORDER BY ${sort_by.replace('.',' ')} LIMIT ${(page-1)*20},${page*20}`))[0]
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
    const user = (await this.connection.execute(`SELECT * FROM user where email='${email}' ${password?`and password='${encrypt(password)}'`:''}`))[0][0]
    if(user){
      user.addresses = (await this.connection.execute(`SELECT zip_code, address.address, city, state, id, country FROM address join user_address on user_address.address=id where user='${user.id}'`))[0]
    }
    return user
  }

  async getCartId({email}){
    return (await this.connection.execute(`select cart.id from cart join user on cart.user=user.id where email='${email}'`))[0][0]
  }

  async insertCart({id}){
    return (await this.connection.execute(`insert into cart (user) values (${id})`))
  }

  async getCart({id}){
    return (await this.connection.execute(`select h.cart cart_id, grocery.id, title, quantity, price, (select path from grocery_picture where grocery=grocery.id limit 1) thumbnail from grocery join 
(SELECT * from grocery_cart where grocery_cart.cart=${id}) h on grocery.id=h.grocery`))[0]
  }

  async updateQuantityGroceryCart({cart, grocery, amount}){
    return (await this.connection.execute(`update grocery_cart set quantity=quantity+${amount} where cart=${cart} and grocery=${grocery}`))
  }

  async insertGroceryCart({cart, grocery}){
    return (await this.connection.execute(`insert into grocery_cart (cart, grocery, quantity)
VALUES(${cart}, ${grocery}, 1)`))
  }

  async deleteGroceryCart({cart, grocery, amount}){
    return (await this.connection.execute(`delete from grocery_cart where cart=${cart} and grocery=${grocery}`))
  }

  async getUserByEmail({email}){
    return (await this.connection.execute(`SELECT * FROM user where email='${email}'`))[0][0]
  }

  async updateUserPassword(password, id){
    return (await this.connection.execute(`UPDATE user set password='${encrypt(password)}' where id='${id}'`))[0][0]
  }

  async createUser({name, email, password, phone}){
    return await this.connection.execute(`INSERT user (email, name, phone, password) values('${email}', '${name}', ${phone?`'${phone}'`:'null'}, '${encrypt(password)}')`)
  }

  async createOrder({address_id, cart, user_id}){
    const response = await this.connection.execute(`INSERT \`order\` (user, address) values(${user_id}, ${address_id})`)
    for(const g of cart){
      const responseGrocery = await this.connection.execute(`INSERT grocery_order (\`order\`, grocery, quantity, price) values(${response[0].insertId}, ${g.id}, ${g.quantity}, ${g.price})`)
      const responseRemove = await this.connection.execute(`DELETE FROM grocery_cart where cart=${g.cart_id} and grocery=${g.id}`)
    }
    return {}
  }

  async createAddress({address, zip_code, city, state, country, user_id}){
    const response = await this.connection.execute(`INSERT address (address, zip_code, city, state, country) values('${address}', '${zip_code}', '${city}', '${state}', '${country}')`)
    const responseUser = await this.connection.execute(`INSERT user_address (user, address) values('${user_id}', '${response[0].insertId}')`)
    return response[0].insertId
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
