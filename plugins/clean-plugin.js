const fs = require('fs')
const path = require('path')
class htmlPlugin {
  deleteFn=(url) => {
    let files = []
    if (fs.existsSync(url)) {
      files = fs.readdirSync(url)
      files.forEach((file, index) => {
        const curpath = path.join(url, file)
        if (fs.statSync(curpath).isDirectory()) {
          this.deleteFn(curpath)
        } else {
          fs.unlinkSync(curpath)
        }
      })
      fs.rmdirSync(url)
    } else {
      console.log('路径不存在')
    }
  }

  apply (compiler) {
    this.deleteFn(compiler.options.output.path)
  }
}
module.exports = htmlPlugin
