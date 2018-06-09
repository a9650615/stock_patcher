import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'
import FilesHelpter from '../utilits/fileHelper'

export default class BasePatcher {
  defaultString = null
  html = null
  data = null

  async getWebSiteByUrl (url) {
    const { data } = await axios.get(url)
    this.defaultString = data
    this.parseTag()
  }

  parseTag () {
    this.html = cheerio.load(this.defaultString)
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
            FilesHelpter.append(`${tmpData.join(',')}\n`)
          })
        }
        FilesHelpter.close()
      }
    }
  }

}