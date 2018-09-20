var NodeRepl = require('repl')
var Hint = require('./Hint')
var help = require('./InlineHelp')

module.exports = {
  start
}

function raw(result) {
  result._repl_raw = typeof result === 'string'
  return result
}

const MAX_STRING_LENGTH = 1000

function shouldEllipsizeString(result) {
  return (
    typeof result === 'string' &&
    result.length > MAX_STRING_LENGTH &&
    !result._repl_raw
  )
}

function ellipsize(string) {
  return string.slice(0, MAX_STRING_LENGTH) + '...'
}

function start(connector) {
  Hint.show('ReplStarted')

  const repl = NodeRepl.start()
  const defaultEval = repl.eval

  repl.eval = function customEval(cmd, context, filename, callback) {
    defaultEval(cmd, context, filename, (err, result) => {
      if (result instanceof Promise) {
        Hint.show('Awaiting')
        result
          .then(resolved => {
            callback(undefined, resolved)
          })
          .catch(rejected => {
            callback(rejected)
          })
      } else if (result && typeof result.html === 'function') {
        Hint.show('CheerioUnreadable')
        const betterCmd = cmd + '.text().slice() // or .html()'
        customEval(betterCmd, context, filename, callback)
      } else if (shouldEllipsizeString(result)) {
        Hint.show('StringEllipsized')
        callback(err, ellipsize(result))
      } else if (result && result._repl_raw === false) {
        Hint.show('RawStringOnly')
        callback(err, undefined)
      } else {
        callback(err, result)
      }
    })
  }

  Object.assign(repl.context, {
    connector,
    help,
    raw
  })
}
