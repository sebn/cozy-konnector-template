var Connector = require('./libs/Connector')

var requestOptions = {
  jar: true
}

// eslint-disable-next-line
var steps = [
]

var connector = Connector.init({ requestOptions, steps })

module.exports = connector
