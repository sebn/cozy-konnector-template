var Connector = require('./libs/Connector')
var { signin } = require('cozy-konnector-libs')

var requestOptions = {
  jar: true
}

// eslint-disable-next-line
var steps = [
  login
]

var connector = Connector.init({ requestOptions, steps })

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

module.exports = connector
