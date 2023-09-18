const encrypt = require('../util/encrypt')
const DAL = require('./DAL')

class UserDAL extends DAL{
  async getUser({email, password}){
    const user = (await this.connection.execute(`
      SELECT * FROM user 
      WHERE 
        email=${this.escape(email)} ${password?`
        AND password='${encrypt(password)}'`:''}
    `))[0][0]
    if(user){
      user.addresses = (await this.connection.execute(`
        SELECT 
          zip_code, 
          address.address, 
          city, 
          state, 
          id, 
          country
        FROM address JOIN user_address ON user_address.address=id 
        WHERE user='${user.id}'
      `))[0]
      user.cart = (await this.connection.execute(`
        SELECT 
          h.cart cart_id, 
          grocery.id, 
          title, 
          quantity, 
          price, 
          (select path from grocery_picture where grocery=grocery.id limit 1) thumbnail 
        FROM 
          grocery JOIN (SELECT * FROM grocery_cart JOIN cart ON cart=cart.id WHERE user=${user.id}) h ON grocery.id=h.grocery`
      ))[0] 
    }
    return user
  }

  async getUsers(){
    return (await this.connection.execute(`
      SELECT * FROM user
    `))[0]
  }

  async getUserByEmail({email}){
    return (await this.connection.execute(`
      SELECT * FROM user where email=${this.escape(email)}
    `))[0][0]
  }

  async createUser({name, email, password, phone}){
    const response = await this.connection.execute(`
          INSERT user (
                        email, 
                        name, 
                        phone, 
                        password
                      ) 
          VALUES      (
                        ${this.escape(email)}, 
                        ${this.escape(name)}, 
                        ${phone?`${this.escape(phone)}`:'null'}, 
                        '${encrypt(password)}'
                      )
        `)
    return response
  }

  async createAddress({address, zip_code, city, state, country, user_id}){
    const response = await this.connection.execute(`
      INSERT address (
        address, 
        zip_code, 
        city, 
        state, 
        country
      ) VALUES (
        ${this.escape(address)}, 
        ${this.escape(zip_code)}, 
        ${this.escape(city)}, 
        ${this.escape(state)}, 
        ${this.escape(country)}
      )
    `)
    const responseUser = await this.connection.execute(`
      INSERT user_address (user, address) 
      VALUES ('${user_id}', '${response[0].insertId}')
    `)
    return response[0].insertId
  }

  async updateUserPassword(password, id){
    return (await this.connection.execute(`
      UPDATE user SET password='${encrypt(password)}' WHERE id=${id}
    `))[0][0]
  }

  async updateUserPhone({phone, id}){
    return (await this.connection.execute(`
      UPDATE user SET phone=${this.escape(phone)} WHERE id=${id}
    `))[0][0]
  }
}

module.exports = new UserDAL()
