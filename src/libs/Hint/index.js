const cardinal = require('cardinal')
const Fs = require('fs')
const Path = require('path')

module.exports = {
  show
}

function show(...hints) {
  for (let hint of hints) {
     // eslint-disable-next-line no-console
    console.log(cardinal.highlightFileSync(path(hint)))
  }
}

function path(hint) {
  return Path.join(__dirname, `${hint}.js`)
}
