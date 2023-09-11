const mysql = require('mysql2/promise')
const fs = require('fs')

class DAL{
  constructor(){
    this.connect()
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

module.exports = DAL;
