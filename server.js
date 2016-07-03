const http = require('http')
const ecstatic = require('ecstatic')
const HttpHashRouter = require('http-hash-router')
const sendError = require('send-data/error')
const sendHtml = require('send-data/html')
const sendJS = fn => (req, res) => {
  res.writeHead(200, {'content-type': 'text/javascript'})
  res.end(fn())
}

const router = HttpHashRouter()

router.set('/', (req, res) => sendHtml(req, res, index()))
router.set('/config.js', sendJS(configJs))
router.set('/app.js', sendJS(appJs))
router.set('/get.js', sendJS(getJs))
router.set('/notebook.js', sendJS(notebookJs))

router.set('*', (req, res) => ecstatic({
  root: process.cwd(),
  handleError: false,
  showDir: false
})(req, res, function (err) {
    if (/.md$/.test(req.url)) {
      res.writeHead(200, {'content-type': 'text/markdown; charset=UTF-8'})
      res.end(`
# File Not Found

[Home](/)
          `)
      return
    }
    // other wise point back to basic html
    sendHtml(req, res, index())
  })
)

const server = http.createServer(function (req, res) {
  router(req, res, {}, (err) => {
    sendHtml(req, res, index())
  })
})

server.on('error', (err) => console.log(err))

module.exports = port =>
  server.listen(port || process.env.PORT || 3000)

if (!module.parent) {
  server.listen(process.env.PORT || 3000)
}

function index () {
  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta >
    <title>CodeCampKit</title>
    <meta name="description" content="CodeCamp Kit Guide">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- css files -->
    <link rel="stylesheet" href="https://npmcdn.com/github-markdown-css@2.3.0">
    <style>
      .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
      }
    </style>
    <!-- /css files -->
    <script src="https://jspm.io/system@0.19.js"></script>
    <script src="/config.js"></script>
  </head>
  <body>
    <!--[if lt IE 8]>
        <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->



    <script>
      System.import('/app.js')
    </script>
    <script src="https://embed.tonicdev.com"></script>
  </body>
</html>
`
}

function configJs () {
  return `
System.defaultJSExtensions = false
System.config({
  paths: {
    "*": "https://wzrd.in/standalone/*",
  }
})
  `
}

function appJs () {
  return `
const domify = require('domify')
const marked = require('marked')
const page = require('page')
const morphdom = require('morphdom')

const get = require('./get.js')
const renderNotebook = require('./notebook.js')

const view = b => domify('<div id="app" class="markdown-body">' + marked(b) + '</div>')
const el = view('Loading...')
const render = b => morphdom(el,view(b))

document.body.appendChild(el)

page('/', ctx => get('/README.md').then(render))
page('/:lesson', ctx => get('/' + ctx.params.lesson + '/README.md').then(render))
page('/:lesson/:name', ctx => {
  get('/' + [ctx.params.lesson, ctx.params.name + '.md'].join('/')).then(b => {
    render(b)
    renderNotebook('.tonic')
  })
})
page()

// load last url endpoint
if (window.location.pathname !== '/') page(window.location.pathname)
  `
}

function getJs () {
  return `
const xhr = require('xhr')
module.exports = url =>
  new Promise(resolve => {
    xhr(url, (e,r,b) => {
      if (e) {
        console.log(e.message)
        return
      }
      resolve(b)
    })
  })
  `
}

function notebookJs () {
  return `
const { compose, map } = require('ramda')

const selectors = s => document.querySelectorAll(s)
const create = element => {
  Tonic.createNotebook({ element: element, source: element.innerText })
  return element
}

const hidePre = element => {
  element.querySelector('pre').style.display = 'none'
  return element
}

const process = compose(hidePre, create)

module.exports = _ => compose(map(process),selectors)('.tonic')
  `
}
