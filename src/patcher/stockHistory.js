import Base from './base'

class StickqHistory extends Base {
  async getData(data) {
    const date = new Date(Date.parse(data))
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    await this.getWebSiteByUrl(`http://www.stockq.org/stock/history/${year}/${month}/${year}${month}${day}_tc.php`)
    console.log(`Getting: http://www.stockq.org/stock/history/${year}/${month}/${year}${month}${day}_tc.php`)
    this._parseData()

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
    console.log(data)
  }

  async getDataRange(data) {
    const date = new Date(Date.parse(data))
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    await this.getWebSiteByUrl(`http://www.stockq.org/stock/history/${year}/${month}/${year}${month}${day}_tc.php`)
    console.log(`Getting: http://www.stockq.org/stock/history/${year}/${month}/${year}${month}${day}_tc.php`)
    this._parseDataRange()
    return this
  }

  _parseDataRange() {
    let data = {}
    this.html('.marketdatatable,.bonddatatable').each((index, value) => {
      const type = this.html(value).find('tr:nth-child(1)>td b').text().trim()
      const rowSize = this.html(value).find('tr:nth-child(2)>td').length
      // console.log(rowSize)
      this.html(value).find('tr.row1, tr.row2').each((index , element) => {
        const detailType = this.html(element).find('td:nth-child(1)').text()
        let tmpData = {}
        data[`${type}-${detailType}`.replace('/','')] = []
        console.log(`${type}-${detailType}`)
        // for(let i=1 ; i<rowSize ; i++) {
        //   tmpData[this.html(value).find('tr:nth-child(2)>td').eq(i).text()] = this.html(element).find('td').eq(i).text()
        // }
        // data[type].push(tmpData)
      })
    })
    this.data = data
  }
}

export default new StickqHistory()
