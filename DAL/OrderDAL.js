const DAL = require('./DAL')

class OrderDAL extends DAL{
  async createOrder({address_id, cart, user_id}){
    const response = await this.connection.execute(`INSERT \`order\` (user, address) values(${user_id}, ${this.escape(address_id)})`)
    for(const g of cart){
      await this.connection.execute(`INSERT grocery_order (\`order\`, grocery, quantity, price) values(${response[0].insertId}, ${g.id}, ${g.quantity}, ${g.price})`)
      await this.connection.execute(`DELETE FROM grocery_cart where cart=${g.cart_id} and grocery=${g.id}`)
    }
    return response[0].insertId
  }

  async getOrder({id, user}){
    let res = undefined
    if(user.is_admin){
      res = (await this.connection.execute(`SELECT * FROM \`order\` where id=${id}`))[0][0]
    } else {
      res = (await this.connection.execute(`SELECT * FROM \`order\` where id=${id} and user=${user.id}`))[0][0]
    }
    if(res){
      res.groceries = (await this.connection.execute(`SELECT title, grocery, grocery id, quantity, grocery_order.price FROM grocery_order join grocery on grocery=id where \`order\`=${id}`))[0]
      res.address_info = (await this.connection.execute(`SELECT * FROM address where id=${res.address}`))[0][0]
      res.user_info = (await this.connection.execute(`SELECT * FROM user where id=${res.user}`))[0][0]
      return res
    }
    return {}
  }

  async getOrders({page, q}){
    const results = (await this.connection.execute(`
        SELECT *, 
          (SELECT sum(price)*sum(quantity) FROM grocery_order WHERE \`order\`=id) total_price, 
          (SELECT sum(quantity) FROM grocery_order WHERE \`order\`=id) total_products ,
          (SELECT email FROM user WHERE id=user) user_email
        FROM \`order\` 
        HAVING (SELECT email FROM user WHERE id=user) like '%${q}%' or id like '%${q}%'
        ORDER BY order_date DESC
        LIMIT ${(page-1)*20},${page*20}
      `))[0]
    const pages = (await this.connection.execute(`
    SELECT ceil(count(id)/20) pages, user, id FROM \`order\`
    HAVING (SELECT email FROM user WHERE id=user) like '%${q}%' or id like '%${q}%'
    `))[0][0]
    return {...pages, results}
  }

  async getOrdersFromUser({user, page, q}){
    const results = (await this.connection.execute(`
        SELECT *, 
          (select sum(price)*sum(quantity) from grocery_order where \`order\`=id) total_price, 
          (select sum(quantity) from grocery_order where \`order\`=id) total_products 
        FROM \`order\` 
        WHERE
          user=${user}
          AND id like '%${q}%'
        ORDER BY order_date DESC
        LIMIT ${(page-1)*20},${page*20}
      `))[0]
    const pages = (await this.connection.execute(`
    SELECT ceil(count(id)/20) pages 
    FROM \`order\` 
    WHERE 
      user=${user}
      AND id like '%${q}%'
    `))[0][0]
    return {...pages, results}
  }
}

module.exports = new OrderDAL()
