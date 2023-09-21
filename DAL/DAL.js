const mysql = require('mysql2/promise')

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

  escape(param){
    if(!param) return 'NULL'
    return mysql.escape(param)
  }
}

module.exports = DAL
