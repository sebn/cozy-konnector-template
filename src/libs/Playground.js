var fs = require('fs-extra')
var path = require('path')

module.exports = {
  create,
  isMissing
}

const filePath = path.join(__dirname, '..', '..', 'playground.js')

async function create() {
  await fs.ensureFile(filePath)
}

async function isMissing() {
  const exists = await fs.exists(filePath)
  return !exists
}
