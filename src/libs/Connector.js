var autoBind = require('auto-bind')
var cheerio = require('cheerio')
var { BaseKonnector, requestFactory } = require('cozy-konnector-libs')
// var http = require('http')
var opn = require('opn')

var ConnectorRepl = require('./ConnectorRepl')
var Hint = require('./Hint')
var Playground = require('./Playground')
var PrivateDir = require('./PrivateDir')

require('./CheerioWorkaround')

module.exports = {
  init,
  wrap
}

// TODO: Separate connector logic from development helpers
class DevConnector {
  constructor({ requestOptions, steps }) {
    this.request = requestFactory({
      cheerio: false,
      json: false,
      resolveWithFullResponse: true,
      jar: requestOptions.jar
    })
    this.state = {}
    this.steps = steps
    autoBind(this)
  }

  async run(fields) {
    this.fields = this.fields || fields

    for (let fn of this.steps) {
      await this._runStep(fn)
    }

    if (await Playground.isMissing()) {
      await Playground.create()
      Hint.show('FirstRun')
    }
  }

  async _runStep(fn) {
    const result = await fn(this)
    this.clear()

    // if (result instanceof http.IncomingMessage) this.response = result
    if (result && result.headers) this.response = result
    else if (typeof result === 'string') this._body = result
    else if (result && result.html) this._$ = result
    else if (result) this.state = result
    // else if (result === undefined) {
    //   // eslint-disable-next-line no-console
    //   console.log(`Your ${fn.name} step does not return anything!`)
    // } else {
    //   // eslint-disable-next-line no-console
    //   console.log(`Your ${fn.name} step returned an unexpected result:`, result)
    // }

    if (this.body && fn.name) {
      this.lastPage = await PrivateDir.savePage(fn.name, this.body)
      // console.log(`Page saved in ${this.lastPage}`) // eslint-disable-line no-console
    }
  }

  async compose(...substeps) {
    for (let fn of substeps) {
      await this._runStep(fn)
    }
    this._showHints()
  }

  async step(fn) {
    await this._runStep(fn)
    this._showHints()
  }

  _showHints() {
    if (this.response) Hint.show('Response', 'Page', 'Cheerio')
    else if (this._body) Hint.show('Page', 'Cheerio')
    else if (this._$) Hint.show('Cheerio')
  }

  clear() {
    delete this.response
    delete this._body
    delete this._$
  }

  get body() {
    return this._body || (this.response && this.response.body)
  }

  get $() {
    if (this.body && !this._$) {
      this._$ = cheerio.load(this.body)
    }
    return this._$
  }

  text() {
    console.log(this.$.text().replace(/\s\s+/g, '\n')) // eslint-disable-line no-console
  }

  page() {
    if (this.lastPage) opn(this.lastPage)
    else console.log("Last step didn't access any page.") // eslint-disable-line no-console
  }
}

function init(...args) {
  return new DevConnector(...args)
}

function wrap(connector) {
  return new BaseKonnector(async function start(fields) {
    await connector.run(fields)
    ConnectorRepl.start(connector)
  })
}
