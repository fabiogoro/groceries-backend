const mysql = require('mysql2/promise')
const fs = require('fs')

class DAL{
  constructor(){
    this.connect()
  }

  async connect(){
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASS
    })
  }
}

module.exports = DAL;
