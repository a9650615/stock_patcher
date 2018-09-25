import MysqlUtility from '../utilits/mysql'

class CompanyHelper {

  preFormat = (value) => {
    // if (value.charAt(0) === '0' && value.length > 4) {
    //   return value.substring(value.length - 4, value.length)
    // }
    return value
  }

  makeDataYield = function *(data) {
    for (let index = 0; index < data.length; index++) {
      if (index == data.length - 1)
        return this.preFormat(data[index].no)
      else
        yield this.preFormat(data[index].no)
    }
  }

  //return yield
  async getAllCompany() {
    const companyList = await MysqlUtility.query(`SELECT * FROM \`tw_company_list\``)
    const data = this.makeDataYield(companyList)
    return data
  }
}

export default new CompanyHelper()
