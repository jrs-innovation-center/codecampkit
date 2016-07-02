const http = require('http')
const HttpHashRouter = require('http-hash-router')
const sendHtml = require('send-data/html')
const sendError = require('send-data/error')
const filed = require('filed')
const layout = require('./layout')
const fs = require('fs')
const path = require('path')

const router = HttpHashRouter()

const read = (name, cb) => fs.readFile(path.resolve('.', name + '.md'), 'utf-8', cb)

const render = (req,res) => name => read(name, (err, content) => {
  if (err) { return sendError(req, res, {body: JSON.stringify(err)}) }
  sendHtml(req, res, layout(content))
})

router.set('/github-markdown.css', (req, res) =>
  filed(__dirname + '/github-markdown.css').pipe(res)
)

router.set('/:lesson/:lab', (req, res, opts) => {
  render(req,res)(opts.params.lesson + '/' + opts.params.lab)
})

router.set('/:lesson', (req, res, opts) => {
  render(req,res)(opts.params.lesson + '/README')
})

router.set('/', (req, res) => {
  render(req,res)('README')
})

module.exports = port => {
  const server = http.createServer( (req, res) => {
    router(req,res, {}, err => sendError(req, res, { body: JSON.stringify(err) }))
  })

  server.listen(process.env.PORT || port || 3000)
}
