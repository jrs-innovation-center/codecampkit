/**
 * basic server modules
 */
const http = require('http')
const ecstatic = require('ecstatic')
const HttpHashRouter = require('http-hash-router')
const filed = require('filed')

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
 * Default route serve index.html
 */
router.set('/', (req, res) => filed(__dirname + '/client/index.html').pipe(res))

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
    filed(__dirname + '/client/index.html').pipe(res)
  })
)

/**
 * handle server requests
 */
const server = http.createServer(function (req, res) {
  router(req, res, {}, (err) => {
    filed(__dirname + '/client/index.html').pipe(res)
  })
})

/**
 * export listen command
 */
module.exports = port =>
  server.listen(port || process.env.PORT || 3000)

/**
 * if no parent then listen
 */
if (!module.parent) {
  server.listen(process.env.PORT || 3000)
}
