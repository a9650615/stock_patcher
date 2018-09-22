import MysqlUtility from '../utilits/mysql'

class CompanyHelper {
  makeDataYield = function *(data) {
    for (let index = 0; index < data.length; index++) {
      if (index == data.length - 1)
        return data[index].no
      else
        yield data[index].no
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
