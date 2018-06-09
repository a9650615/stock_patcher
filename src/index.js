import Program from 'commander'
import StockHistory from './patcher/stockHistory'

let data = {
  date: null,
  range: false
}

const main = async () => {
  if (data.date) {
    (await StockHistory.getData(data.date)).toFiles()
  } 
  else if (data.range) {
    (await StockHistory.getDataRange('2015/01/02'))
  }
  else {
    console.log('未執行任何動作')
  }
}

const setDate = (date) => {
  if (Date.parse(date)) {
    data.date = date
  } else {
    console.warn('-d: 請輸入正確的時間格式')
  }
}

const setRange = (date) => {
  console.log('range')
  data.range = true
}

Program
  .version('0.0.1alpha')

Program
  .command('patch')
  .description('爬取資料')
  .option('-s, --single', 'Get Single date data')
  .option('-d, --date [date]', 'Select a date', setDate)
  .option('-r, --range', 'Select a date range', setRange)
  .action((env) => {
    main()
  })

Program.parse(process.argv)
