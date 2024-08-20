const mysql = require('mysql')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'besafx'
})

db.connect((e) => {
  if (e) console.log("DB imeshindwa kuconnect", e)
  else console.log("Database CONECTED FRESh")
})

module.exports = db
 