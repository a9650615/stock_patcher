import Program from 'commander'
import StickqHistory from './patcher/stickqHistory'

let data = {
  date: null,
}

const main = async () => {
  if (data.date) {
    (await StickqHistory.getData(data.date)).toFiles()
  } else {
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

Program.parse(process.argv)
