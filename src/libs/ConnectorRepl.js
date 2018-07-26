var NodeRepl = require('repl')
var help = require('./InlineHelp')

module.exports = {
  start
}

function start(connector) {
  const repl = NodeRepl.start()
  const defaultEval = repl.eval

  repl.eval = function customEval(cmd, context, filename, callback) {
    defaultEval(cmd, context, filename, (err, result) => {
      if (result instanceof Promise) {
        result.then(console.log).catch(console.error) // eslint-disable-line
        result = undefined
      }
      callback(err, result)
    })
  }

  Object.assign(repl.context, {
    connector,
    help
  })
}
