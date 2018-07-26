module.exports = help

function help() {
  console.log(
    'Help topics are available as properties of this `help` function-object.'
  )
  console.log(
    'Use the completion of the Node.js REPL to list them by typing help. + TAB'
  )
}

help.api = {
  signin() {
    console.log('blah')
  }
}
