import Program from 'commander'
import Controller from './controller'
import LibraryHelper from './libraryHelper'
import StockHistory from './patcher/stockHistory'

const main = async () => {
  let data = Controller.data()
  const library = LibraryHelper.get(data.library)
  console.log(data.startDate, data.toDate)
  if (data.date) {
    (await library.getData(data.date, data.no)).toFiles()
    // (await StockHistory.getData(data.date)).toFiles()
  } 
  else if (data.startDate && data.toDate) {
    if (data.toDatabase) {
      // console.log(data.startDate, data.toDate)
      (await library.getDataRange(data.startDate, data.toDate, data.no)).toDatabase()
    } else {
      (await library.getDataRange(data.startDate, data.toDate, data.no)).toFiles()
    }
  }
  else {
    console.log('未執行任何動作')
  }
  return null
}

Program
  .version('0.0.1alpha')

Program
  .command('patch')
  .description('爬取資料')
  .option('-s, --source [source]', 'Get data from source, please bind stock no option.', Controller.setLibrary)
  .option('-no, --stockNo [source]', 'Get data from source', Controller.setNo)
  // .option('-s, --single', 'Get Single date data')
  .option('-d, --date [date]', 'Select a date', Controller.setDate)
  .action((env) => {
    main()
  })

Program
  .command('batch-patch')
  .description('爬取範圍')
  .option('-s, --source [source]', 'Get data from source, please bind stock no option.', Controller.setLibrary)
  .option('-no, --stockNo [source]', 'Get data from source', Controller.setNo)
  .option('-f, --from [date]', 'from date', Controller.setStart)
  .option('-t, --to [date]', 'to date', Controller.setTo)
  .option('-d, --database', 'get data to database', Controller.setToDatabase)
  .action((env) => {
    main()
  })

Program.parse(process.argv)
