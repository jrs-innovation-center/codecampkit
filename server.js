/**
 * basic server modules
 */
const http = require('http')
const ecstatic = require('ecstatic')
const HttpHashRouter = require('http-hash-router')
const filed = require('filed')
const fs = require('fs')
const ejs = require('ejs')
const pkg = require(process.cwd() + '/package.json')
const sendHtml = require('send-data/html')
const summary = require('server-summary')

/**
 * Create Router
 */
const router = HttpHashRouter()

/**
 * Default ecstatic options
 */
const options = {
  root: process.cwd(),
  handleError: false,
  showDir: false,
  cache: 0
}

/**
  * Index
  */
let index = null

try {
  index = fs.readFileSync(process.cwd() + '/index.html', 'utf-8')
} catch (e) {
  index = ejs.render(fs.readFileSync(__dirname + '/index.ejs.html', 'utf-8'),pkg)
}

/**
 * Default route serve index.html
 */
router.set('/', (req, res) => {
  sendHtml(req, res, index)
})

/**
 * serve client js files
 */
router.set('/js/:name', (req, res, data) => filed(`${__dirname}/client/js/${data.params.name}`).pipe(res))

/**
 * serve markdown files or any other files in the project directory
 */
router.set('*', (req, res) => ecstatic(options)(req, res, function (err) {
    if (/.md$/.test(req.url)) {
      return filed(__dirname + '/client/404.md').pipe(res)
    }
    // other wise point back to basic html
    sendHtml(req, res, index)
  })
)

/**
 * handle server requests
 */
const server = http.createServer(function (req, res) {
  router(req, res, {}, (err) => {
    sendHtml(req, res, index)
  })
})

/**
 * export listen command
 */
module.exports = port =>
  server.listen(port || process.env.PORT || 3000, summary(server))

/**
 * if no parent then listen
 */
if (!module.parent) {
  server.listen(process.env.PORT || 3000, summary(server))
}
