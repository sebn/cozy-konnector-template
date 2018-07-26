var Connector = require('./libs/Connector')
var connector = require('./connector')

module.exports = Connector.wrap(connector)
