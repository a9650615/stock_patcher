import fs from 'fs'

class FileHelper {
  nowFile = null

  needFolder (path) {
    if (!fs.existsSync(path) || !fs.lstatSync(path).isDirectory()) {
      fs.mkdirSync(path)
    }
  }

  saveData (path, data) {
    fs.writeFileSync(path, data)
  }

  create (file, clear = false) {
    if (clear) {
      fs.writeFileSync(file, '')
    }
    this.nowFile = file

    return this
  }

  append (data) {
    fs.appendFileSync(this.nowFile, data)

    return this
  }

  close (file) {
    this.nowFile = null
  }

}

export default new FileHelper();
