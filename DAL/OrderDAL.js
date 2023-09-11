const DAL = require('./DAL')

class OrderDAL extends DAL{
  async createOrder({address_id, cart, user_id}){
    const response = await this.connection.execute(`INSERT \`order\` (user, address) values(${user_id}, ${address_id})`)
    for(const g of cart){
      const responseGrocery = await this.connection.execute(`INSERT grocery_order (\`order\`, grocery, quantity, price) values(${response[0].insertId}, ${g.id}, ${g.quantity}, ${g.price})`)
      const responseRemove = await this.connection.execute(`DELETE FROM grocery_cart where cart=${g.cart_id} and grocery=${g.id}`)
    }
    return response[0].insertId
  }

  async getOrder({id, user}){
    const res = (await this.connection.execute(`SELECT * FROM \`order\` where id=${id} and user=${user}`))[0][0]
    if(res){
      res.groceries = (await this.connection.execute(`SELECT * FROM grocery_order join grocery on grocery=id where \`order\`=${id}`))[0]
      return res
    }
    return {}
  }

  async getOrders({user}){
    const res = (await this.connection.execute(`
      SELECT *, 
        (select sum(price)*sum(quantity) from grocery_order where \`order\`=id) total_price, 
        (select sum(quantity) from grocery_order where \`order\`=id) total_products 
      FROM \`order\` 
      WHERE
        user=${user}
      ORDER BY order_date DESC
    `))[0]
    return res
  }
}

module.exports = new OrderDAL()
