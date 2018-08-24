import Base from './base'

class TWSEPatcher extends Base {
  dbName = 'tw_stock_price'
  async getData (date, no) {
    const { year, month, day } = this.parseDate(date)
    if (!no || no == null) {
      console.warn('請輸入股票編號')
      throw new Error('沒有設定股票編號')
    }
    await this.getApiFromUrl(`http://www.twse.com.tw/zh/exchangeReport/STOCK_DAY?date=${`${year}${month}01`}&stockNo=${no}`)
    this._parseData(`${year-1911}/${month}/${day}`)

    return this
  }
  
  keytoObject (keys = [], values = []) {
    const allObjArr = []
    values.forEach((value) => {
      let tmpObj = {}
      keys.forEach((key, i) => {
        tmpObj[key] = value[i]
      })
      allObjArr.push(tmpObj);
    })
    return allObjArr
  }

  _parseData (date) {
    const data = {}
    const title = this.json.title.replace('             ','-')
    data[title] = [...this.keytoObject(this.json.fields, this.json.data.filter((data) => data[0] === date))]
    this.data = data;
  }

  async getDataRange(startDate, toDate, no) {
    if (!no || no == null) {
      console.warn('請輸入股票編號')
      throw new Error('沒有設定股票編號')
    }
    const { time: fromTime, year: fromYear, month: fromMonth  } = this.parseDate(startDate)
    const { time: toTime } = this.parseDate(toDate)
    let lastMonth = fromMonth
    await this.getApiFromUrl(`http://www.twse.com.tw/zh/exchangeReport/STOCK_DAY?date=${`${fromYear}${fromMonth}01`}&stockNo=${no}`)
    const title = this.json.title.replace('             ','-')
    this.data = { [title]: [] }
    for(let dateTime = fromTime; dateTime <= toTime; dateTime += 86400) {
      const { year, month, day } = this.parseDate(dateTime*1000)
      const search = (this.json.data||[]).filter((data) => data[0] === `${year-1911}/${month}/${day}`)
      if (!search.length >= 1 && lastMonth != month) {
        lastMonth = month
        await this.getApiFromUrl(`http://www.twse.com.tw/zh/exchangeReport/STOCK_DAY?date=${`${year}${month}01`}&stockNo=${no}`)
      }
      await this._parseDataRange(`${year-1911}/${month}/${day}`, title, no)
    }
    return this;
  }

  async _parseDataRange (date, title, no) {
    const findData = this.keytoObject(this.json.fields, (this.json.data||[]).filter((data) => data[0] === date))[0];
    if (findData) {
      const date = findData['日期'].toString().split('/');
      console.log(`get: ${(Number(date[0])+1911)}/${date[1]}/${date[2]}-`+`${date[0]}/${date[1]}/${date[2]}`)
      findData['日期'] = `${(Number(date[0])+1911)}/${date[1]}/${date[2]}`
      this.data[title].push(Object.assign(findData, { no: no }))
    }
  }
}

export default new TWSEPatcher();
