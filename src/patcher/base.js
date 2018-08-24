import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'
import FilesHelpter from '../utilits/fileHelper'
import MysqlUtilits from '../utilits/mysql'

export default class BasePatcher {
  defaultString = null
  html = null
  data = null
  json = null
  dbName = null

  async getWebSiteByUrl (url) {
    const { data } = await axios.get(url)
    this.defaultString = data
    this.parseTag()
  }

  async getApiFromUrl (url) {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        const { data } = await axios.get(url)
        console.log(`Getting: ${url}`)
        this.json = data
        resolve()
      }, 1000)
    })
  }

  parseDate (data) {
    // console.log(new Date(data))
    // const date = new Date(Date.parse(data))
    const date = new Date(data)
    const time = parseInt(date.getTime() / 1000)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    return {
      time,
      year,
      month,
      day,
    }
  }

  parseTag () {
    this.html = cheerio.load(this.defaultString)
  }

  toCSVstruct(arr) {
    return arr.map((val) => {
      return `"${val}"`
    }).join(',')
  }

  toFiles() {
    const data = this.data
    FilesHelpter.needFolder('output/single_date')
    if (data instanceof Object) {
      for ( let title in data ) {
        FilesHelpter.create(`output/${title}.csv`, true)
        const dataColumn = data[title]
        console.log(`${title}-${data[title].length}筆資料`)
        if (dataColumn.length > 0) {
          const tmpHeader = []
          for (let type in dataColumn[0]) {
            tmpHeader.push(type)
          }
          FilesHelpter.append(`${tmpHeader.join(',')}\n`)
          dataColumn.map((value) => {
            let tmpData = []
            for (let type in value) {
              tmpData.push(value[type])
            }
            if (tmpData.length)
            FilesHelpter.append(`${this.toCSVstruct(tmpData)}\n`)
          })
        }
        FilesHelpter.close()
      }
    }
  }

  async toDatabase() {
    const data = this.data
    if (data instanceof Object) {
      for ( let title in data ) {
        const dataColumn = data[title]
        for(let column of dataColumn ) {
          let tmpData = []
          for (let type in column) {
            tmpData.push(column[type])
          }
          if (this.dbName === 'world_stock_price') {
            await MysqlUtilits.query(`INSERT INTO world_stock_price(price, price_move, ratio, time, local_time, type)
              VALUES('${tmpData[1]}','${tmpData[2]}','${tmpData[3]}','${tmpData[0]}','${tmpData[4]}', '${title}')
            `)
          } else if (this.dbName === 'tw_stock_price') {
            await MysqlUtilits.query(`INSERT INTO tw_stock_price(\`date\`, deal_stock, deal_price, start_price, high_price, low_price, end_price, difference, deal_count, no)
              VALUES('${tmpData[0]}','${tmpData[1]}','${tmpData[2]}','${tmpData[3]}','${tmpData[4]}','${tmpData[5]}','${tmpData[6]}','${tmpData[7]}','${tmpData[8]}', '${tmpData[9]}')
            `)
          }
        }
      }
    }
    console.log('All data write into database!')
  }

}