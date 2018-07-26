var fs = require('fs-extra')
var path = require('path')

const dir = path.join(__dirname, '..', '..', 'private')

module.exports = {
  savePage,
  dir
}

async function savePage(pageName, data) {
  const pagePath = path.join(dir, `${pageName}.html`)
  await fs.outputFile(pagePath, data)
  return pagePath
}
