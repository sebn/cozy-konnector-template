// Welcome to your playground!

// You can write code in this file and evaluate it in the REPL without
// restarting your connector.

// Make sure some shortcut is set up to send some selected text to the
// integrated terminal (bonus points if you can send the current line without
// selecting it, even better if you can send the current top-level code block).

// Now try evaluating some code:

function add(x, y) {
  return x + y
}

add(1, 2)

// Please note we were using a regular function, not an arrow function.
// The reason is const cannot be evaluated multiple times, which means it
// doesn't fit well in a dynamic development environment.
// I recommend you only use function and var for now.

// You're now ready to start developing your connector interactively.
// Feel free to delete all the preceding code from your playground.

// Connectors are implemented as a sequence of steps. Steps can:
// - Make some request
// - Extract ("scrape") some data from the response
// - Save some data in the Cozy

// Usually, your first step will be to authenticate.
// Try evaluating the following code:

var { signin } = require('cozy-konnector-libs')
var connector = require('./src/connector')

function login({ fields: { username, password } }) {
  return signin({
    url: 'http://quotes.toscrape.com/login',
    formSelector: 'form',
    formData: {
      username: username || 'foo',
      password: password || 'bar'
    }
    // FIXME: missing fields
  })
}

connector.step(login)

// Once you're happy with a step, you can move it to `./src/connector.js`.
// But only the function, not the `connector.step(...)` call! :)

// Next try requesting some page to scrape data from:

var baseUrl = 'http://books.toscrape.com'

function requestProducts({ request }) {
  return request(baseUrl)
}

connector.step(requestProducts)

// Now scrape some data out of it:

var { scrape } = require('cozy-konnector-libs')

function parseDocuments({ $, state }) {
  // you can find documentation about the scrape function here :
  // https://github.com/konnectors/libs/blob/master/packages/cozy-konnector-libs/docs/api.md#scrape
  const docs = scrape(
    $,
    {
      title: {
        sel: 'h3 a',
        attr: 'title'
      },
      amount: {
        sel: '.price_color',
        parse: price => parseFloat(price.replace('£', '').trim())
      },
      fileurl: {
        sel: 'img',
        attr: 'src',
        parse: src => `${baseUrl}/${src}`
      },
      filename: {
        sel: 'h3 a',
        attr: 'title',
        parse: title => `${title}.jpg`
      }
    },
    'article'
  )
  return {
    ...state,
    docs: docs.map(doc => ({
      ...doc,
      // the saveBills function needs a date field
      // even if it is a little artificial here (these are not real bills)
      date: new Date(),
      currency: '€',
      vendor: 'template',
      metadata: {
        // it can be interesting that we add the date of import. This is not mandatory but may be
        // useful for debugging or data migration
        importDate: new Date(),
        // document version, useful for migration after change of document structure
        version: 1
      }
    }))
  }
}

connector.step(parseDocuments)

// Now save some data into the Cozy:

var { saveBills } = require('cozy-konnector-libs')

function saveDocuments({ fields, state }) {
  // here we use the saveBills function even if what we fetch are not bills, but this is the most
  // common case in connectors
  return saveBills(state.docs, fields.folderPath, {
    // this is a bank identifier which will be used to link bills to bank operations. These
    // identifiers should be at least a word found in the title of a bank operation related to this
    // bill. It is not case sensitive.
    identifiers: ['books']
  })
}

connector.step(saveDocuments)
