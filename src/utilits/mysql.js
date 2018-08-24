import mysql from 'promise-mysql'
import { db } from '../config'

var mysqlConn = false

mysql.createConnection({
  host: db.host,
  user: db.userName,
  port: db.port,
  password: db.password,
  database: db.name
}).then(function(conn){
  mysqlConn = conn
})

class MysqlUtilits {
  timer = null

  constructor() {
    this.timer = setInterval(() => { 
      if (mysqlConn) {
        clearInterval(this.timer)
        this.preRun()
      }
    }, 100)
  }

  preRun() {
    mysqlConn.query(`
      CREATE TABLE IF NOT EXISTS \`world_stock_price\` (
        \`ID\` int(255) NOT NULL,
        \`price\` float NOT NULL,
        \`price_move\` float NOT NULL,
        \`ratio\` varchar(200) NOT NULL,
        \`time\` date NOT NULL,
        \`local_time\` varchar(25) DEFAULT NULL,
        \`type\` text
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `).catch((err) => {
      console.log(err.sqlMessage)
    })
    mysqlConn.query(`
      ALTER TABLE \`world_stock_price\` ADD PRIMARY KEY (\`ID\`);
    `).catch((err) => {
      console.log(err.sqlMessage)
    })
    mysqlConn.query(`
      ALTER TABLE \`world_stock_price\` MODIFY \`ID\` int(255) NOT NULL AUTO_INCREMENT;
    `).catch((err) => {
      console.log(err.sqlMessage)
    })
    mysqlConn.query(`
      CREATE TABLE IF NOT EXISTS \`tw_stock_price\` (
        \`date\` date NOT NULL,
        \`deal_stock\` float NOT NULL,
        \`deal_price\` float NOT NULL,
        \`start_price\` float NOT NULL,
        \`high_price\` float NOT NULL,
        \`low_price\` float NOT NULL,
        \`end_price\` float NOT NULL,
        \`difference\` float NOT NULL,
        \`deal_count\` int(11) NOT NULL,
        \`no\` varchar(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `).catch((err) => {
      console.log(err.sqlMessage)
    })
  }

  query(text) {
    return mysqlConn.query(text)
  }
}

export default new MysqlUtilits()
