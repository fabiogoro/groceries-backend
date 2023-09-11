const DAL = require('./DAL')

class CartDAL extends DAL{
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
}


module.exports = new CartDAL()
