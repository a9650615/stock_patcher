import Program from 'commander'
import Schedule from 'node-schedule'
import Controller from './controller'
import LibraryHelper from './libraryHelper'
import CompanyHelper from './helper/companyHelper'
// import StockHistory from './patcher/stockHistory'

const main = async (customData = null) => {
  let data = Controller.data()
  const library = LibraryHelper.get(data.library)
  const no = customData || data.no
  console.log(data.startDate, data.toDate)
  if (data.date) {
    if (data.toDatabase) {
      (await library.getData(data.date, no)).toDatabase()
    } else {
      (await library.getData(data.date, no)).toFiles()
    }
    // (await StockHistory.getData(data.date)).toFiles()
  } 
  else if (data.startDate && data.toDate) {
    if (data.needPatchAll) {
      (await library.getAllCompanyDateRange(data.startDate, data.toDate))
    } else {
      if (data.toDatabase) {
        // console.log(data.startDate, data.toDate)
        (await library.getDataRange(data.startDate, data.toDate, no)).toDatabase()
      } else {
        (await library.getDataRange(data.startDate, data.toDate, no)).toFiles()
      }
    }
  }
  else {
    console.log('未執行任何動作')
  }
  return null
}

const schedulePatch = async () => {
  // 0 0 9 * * *
  Schedule.scheduleJob('0 0 1 * * *', async () => {
    let data = Controller.data()
    const date = new Date()
    const preDate = new Date(date.getTime() - 86400000);
    // const library = LibraryHelper.get(Controller.data().library)
    const today = `${preDate.getFullYear()}/${preDate.getMonth()+1}/${preDate.getDate()}`
    console.log(`今天是: ${today} 抓取 ${preDate.getFullYear()}/${preDate.getMonth()}/${preDate.getDate()}`)
    Controller.setDate(today)
    if (data.needPatchAll) {
      const companyNo = await CompanyHelper.getAllCompany()
      let data
      let timer = setInterval(async () => {
        data = companyNo.next()
        await main(data.value)
        if (data.done) {
          clearInterval(timer)
        }
      }, 10000)
    } else {
      await main()
    }
  })
}

Program
  .version('0.0.4')

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
  .option('-a, --all', 'batch patch all company from DB', () => Controller.setNeedPatchAll(true))
  .action((env) => {
    setTimeout(() => {
      main()
    }, 1000)
  })

Program
  .command('schedule-patch')
  .description('定期時間爬取目標資料')
  .option('-s, --source [source]', 'Get data from source, please bind stock no option.', Controller.setLibrary)
  .option('-no, --stockNo [source]', 'Get data from source', Controller.setNo)
  .action((env) => {
    Controller.setToDatabase()
    schedulePatch()
  })

Program
  .command('schedule-patch-all')
  .description('定時爬取全部')
  .option('-s, --source [source]', 'Get data from source', (library) => {
    Controller.setLibrary(library)
    Controller.setNeedPatchAll(true)
  })
  .action((env) => {
    Controller.setToDatabase()
    schedulePatch()
  })

Program.parse(process.argv)
