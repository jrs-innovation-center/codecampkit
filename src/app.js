/**
 * import external modules
 */
const domify = require('domify')
const marked = require('marked')
const page = require('page')
const morphdom = require('morphdom')

/**
 * get handles xhr get requests
 */
const get = require('./get')

/**
 * searches and processes any tonic code blocks
 *
 * <div class="tonic">
 *  <pre><code>
 *    console.log('Hello World')
 *  </code></pre>
 * </div>
 */
const renderNotebook = require('./notebook')

/**
 * embeds jsbin projects
 *
 * <a class="jsbin-embed foo" href="http://jsbin.com/iwovaj/74/embed?js,output">
 *  Simple Animation Tests</a>
 */
const jsbinify = require('./jsbinify')

/** get header and footer */
let h = 'CodeCamp KIT'
let f = 'All Rights Reserved...'

get('/header.md').then(header =>
  h = /File Not Found/.test(header) ? h : header)

get('/footer.md').then(footer =>
  f = /File Not Found/.test(footer) ? f : footer)

/** create view */
const view = b => domify(`
  <div id="app" class="animated fadeIn">
    <header>${marked(h)}</header>
    <div class="markdown-body">${marked(b)}</div>
    <footer>${marked(f)}</footer>
  </div>
`)


/** default view */
const el = view('Loading...')
/** render new view */
const render = (b, cb) => {
  el.className = "animated fadeOut"
  setTimeout(_ => {
    window.scrollTo(0,0)
    morphdom(el,view(b))
    if (cb) cb()
  }, 250)
}

const renderAll = b => render(b, _ => {
  // TODO: create plugins
  renderNotebook('.tonic')
  jsbinify()
})

/** initial view appended */
document.body.appendChild(el)

/** load readme as root */
page('/', ctx => get('/index.md').then(renderAll))
/** load any sub folder readme */
page('/:lesson', ctx => get('/' + ctx.params.lesson + '/index.md')
  .then(renderAll))
/** load any demo or exercise md */
page('/:lesson/:name', ctx => {
  get('/' + [ctx.params.lesson, ctx.params.name + '.md'].join('/'))
    .then(renderAll)
})
/** start local router */
page()

/** if first location is anything other than root then hot load */
if (window.location.pathname !== '/') page(window.location.pathname)
