const DAL = require('./DAL')

class CartDAL extends DAL{
  async getCartId({id}){
    return (await this.connection.execute(`
      SELECT cart.id FROM cart WHERE user='${id}'
    `))[0][0]
  }

  async insertCart({id}){
    const response = (await this.connection.execute(`
      INSERT INTO cart (user) VALUES (${id})
    `))
    return {id: response[0].insertId}
  }

  async getCart({id}){
    return (await this.connection.execute(`
      SELECT 
        h.cart cart_id, 
        grocery.id, 
        title, 
        quantity, 
        price, 
        (select path from grocery_picture where grocery=grocery.id limit 1) thumbnail 
        FROM grocery JOIN
          (SELECT * FROM grocery_cart where grocery_cart.cart=${id}) h ON grocery.id=h.grocery
    `))[0]
  }

  async updateQuantityGroceryCart({cart, grocery, amount}){
    return (await this.connection.execute(`
      UPDATE grocery_cart SET quantity=quantity+${amount} 
      WHERE 
        cart=${cart} 
        AND grocery=${grocery}
    `))
  }

  async insertGroceryCart({cart, grocery}){
    return (await this.connection.execute(`
      INSERT INTO grocery_cart (cart, grocery, quantity)
      VALUES (${cart}, ${grocery}, 1)
    `))
  }

  async deleteGroceryCart({cart, grocery}){
    return (await this.connection.execute(`
      DELETE FROM grocery_cart 
      WHERE cart=${cart} AND grocery=${grocery}
    `))
  }
}


module.exports = new CartDAL()
