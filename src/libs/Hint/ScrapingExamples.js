// Cheerio is a jQuery implementation for Node.js.
// Example to scrape some data (more at https://cheerio.js.org/):

var $ = connector.$
$('h1').text().trim()

// Or you can use our built-in scrape function:

var $ = connector.$
var { scrape } = require('cozy-konnector-libs')
scrape($, {title: 'h3 a'}, '.product_pod')
