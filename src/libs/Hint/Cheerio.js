// Start scraping some date out of the page:

var $ = connector.$
$('h1')

// Or use the built-in scrape function:

var { scrape } = require('cozy-konnector-libs')
var $ = connector.$
scrape($, {
  title: 'h3 a'
}, '.product_pod')

// When ready, save the scraped data for the next step:

function parseProducts({ $, state }) {
  const products = scrape($, {
    title: 'h3 a'
  }, '.product_pod')
  return {...state, products}
}

connector.step(parseProducts)
