import Base from './base'

class StockHistory extends Base {
  dbName = 'world_stock_price'

  async getData(data) {
    const date = new Date(Date.parse(data))
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    await this.getWebSiteByUrl(`http://www.stockq.org/stock/history/${year}/${month}/${year}${month}${day}_tc.php`)
    console.log(`Getting: http://www.stockq.org/stock/history/${year}/${month}/${year}${month}${day}_tc.php`)
    this._parseData({
      date: `${year}/${month}/${day}`
    })

    return this
  }

  _parseData () {
    let data = {}
    this.html('.marketdatatable,.bonddatatable').each((index, value) => {
      const type = this.html(value).find('tr:nth-child(1)>td b').text().trim()
      const rowSize = this.html(value).find('tr:nth-child(2)>td').length
      // console.log(rowSize)
      data[type] = []
      this.html(value).find('tr.row1, tr.row2').each((index , element) => {
        let tmpData = {}
        for(let i=1 ; i<rowSize ; i++) {
          tmpData[this.html(value).find('tr:nth-child(2)>td').eq(i).text()] = this.html(element).find('td').eq(i).text()
        }
        data[type].push(tmpData)
      })
    })
    this.data = data
  }

  async getDataRange(from, to) {
    const fromTime = new Date(from).getTime()/1000
    const toTime = new Date(to).getTime()/1000
    console.log(toTime-fromTime)
    let data = {}
    if (toTime > fromTime) {
      for(let dateTime = fromTime; dateTime <= toTime; dateTime += 86400) {
        const date = new Date(dateTime*1000)
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        const day = ('0' + date.getDate()).slice(-2)
        await this.getWebSiteByUrl(`http://www.stockq.org/stock/history/${year}/${month}/${year}${month}${day}_tc.php`)
        console.log(`Getting: http://www.stockq.org/stock/history/${year}/${month}/${year}${month}${day}_tc.php`)
        this._parseDataRange(data, `${year}/${month}/${day}`)
      }
    }
    return this
  }

  _parseDataRange(data, date) {
    this.html('.marketdatatable,.bonddatatable').each((index, value) => {
      const type = this.html(value).find('tr:nth-child(1)>td b').text().trim()
      const rowSize = this.html(value).find('tr:nth-child(2)>td').length
      // console.log(rowSize)
      this.html(value).find('tr.row1, tr.row2').each((index , element) => {
        const detailType = this.html(element).find('td:nth-child(1)').text()
        const lastType = `${type}-${detailType}`.replace('/','')
        if (!data[lastType])
          data[lastType] = []
        let tmpData = {'時間': date}
        for(let i=1 ; i<rowSize ; i++) {
          // data[lastType].push(this.html(element).find('td').eq(i).text())
          tmpData[this.html(value).find('tr:nth-child(2)>td').eq(i).text()] = this.html(element).find('td').eq(i).text()
        }
        // console.log(data[lastType].length)
        data[lastType].push(tmpData)
      })
    })
    // console.log(data)
    this.data = data
  }
}

export default new StockHistory()
