import StockHistory from './patcher/stockHistory'
import TWSEPatcher from './patcher/twsePatcher'

const libraries = {
  'stock': StockHistory,
  'twse': TWSEPatcher,
}

export default class LibraryHelper {
  static get(helperName) {
    if (helperName in libraries) {
      return libraries[helperName]
    } else {
      console.warn('沒有此來源, 目前只有這些來源:' + Object.keys(libraries))
      throw new Error('沒有此來源')
    }
  }
}
