import Program from 'commander'
import StockHistory from './patcher/stockHistory'

let data = {
  date: null,
  startDate: null,
  toDate: null
}

const main = async () => {
  console.log(data.startDate, data.toDate)
  if (data.date) {
    (await StockHistory.getData(data.date)).toFiles()
  } 
  else if (data.startDate && data.toDate) {
    (await StockHistory.getDataRange(data.startDate, data.toDate)).toFiles()
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

const setStart = (date) => {
  if (Date.parse(date)) {
    data.startDate = date
  } else {
    console.warn('-f: 請輸入正確的時間格式')
  }
}

const setTo = (date) => {
  if (Date.parse(date)) {
    data.toDate = date
  } else {
    console.warn('-t: 請輸入正確的時間格式')
  }
}

Program
  .version('0.0.1alpha')

Program
  .command('patch')
  .description('爬取資料')
  .option('-s, --single', 'Get Single date data')
  .option('-d, --date [date]', 'Select a date', setDate)
  .action((env) => {
    main()
  })

Program
  .command('batch-patch')
  .description('爬取範圍')
  .option('-f, --from [date]', 'from date', setStart)
  .option('-t, --to [date]', 'to date', setTo)
  .action((env) => {
    main()
  })

Program.parse(process.argv)
