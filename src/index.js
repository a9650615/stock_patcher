import Program from 'commander'
import Controller from './controller'
import StockHistory from './patcher/stockHistory'

const main = async () => {
  let data = Controller.data()
  console.log(data.startDate, data.toDate)
  if (data.date) {
    (await StockHistory.getData(data.date)).toFiles()
  } 
  else if (data.startDate && data.toDate) {
    if (data.toDatabase) {
      (await StockHistory.getDataRange(data.startDate, data.toDate)).toDatabase()
    } else {
      (await StockHistory.getDataRange(data.startDate, data.toDate)).toFiles()
    }
  }
  else {
    console.log('未執行任何動作')
  }
}

Program
  .version('0.0.1alpha')

Program
  .command('patch')
  .description('爬取資料')
  .option('-s, --single', 'Get Single date data')
  .option('-d, --date [date]', 'Select a date', Controller.setDate)
  .action((env) => {
    main()
  })

Program
  .command('batch-patch')
  .description('爬取範圍')
  .option('-f, --from [date]', 'from date', Controller.setStart)
  .option('-t, --to [date]', 'to date', Controller.setTo)
  .option('-d, --database', 'get data to database', Controller.setToDatabase)
  .action((env) => {
    main()
  })

Program.parse(process.argv)
