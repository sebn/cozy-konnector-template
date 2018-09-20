var fs = require('fs-extra')
var path = require('path')

module.exports = {
  create,
  isMissing
}

const userFilePath = path.join(__dirname, '..', '..', 'playground.js')
const templatePath = path.join(__dirname, 'Playground.template.js')

async function create() {
  if (!fs.existsSync(userFilePath)) {
    fs.copySync(templatePath, userFilePath)
  }
}

async function isMissing() {
  const exists = await fs.exists(userFilePath)
  return !exists
}
