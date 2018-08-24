import Base from './base'

class TWSEPatcher extends Base {
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
    const title = this.json.title
    data[title] = [...this.keytoObject(this.json.fields, this.json.data.filter((data) => data[0] === date))]
    this.data = data;
  }
}

export default new TWSEPatcher();
