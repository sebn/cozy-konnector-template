// Your connector was run. You can now start playing interactively with it.
// Open ./playground.js and start evaluating some code.

// Usually, your first step will be to authenticate.
// Put the following code in the `playground.js` file and evaluate it:

var { signin } = require('cozy-konnector-libs')
var connector = require('./src/connector')

function myFirstStep({ fields: { username, password } }) {
  return signin({
    url: 'http://quotes.toscrape.com/login',
    formSelector: 'form',
    formData: { username, password }
  })
}

connector.step(myFirstStep)

// You can also make a custom request:
function myOtherFirstStep({ request }) {
  return request('http://books.toscrape.com/')
}

connector.step(myOtherFirstStep)
