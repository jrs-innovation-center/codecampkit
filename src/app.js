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
const get = require('js:get')

/**
 * searches and processes any tonic code blocks
 *
 * <div class="tonic">
 *  <pre><code>
 *    console.log('Hello World')
 *  </code></pre>
 * </div>
 */
const renderNotebook = require('js:notebook')

/**
 * embeds jsbin projects
 *
 * <a class="jsbin-embed foo" href="http://jsbin.com/iwovaj/74/embed?js,output">
 *  Simple Animation Tests</a>
 */
const jsbinify = require('js:jsbinify')

/** create view */
const view = b => domify('<div id="app" class="markdown-body animated fadeIn">' + marked(b) + '</div>')
/** default view */
const el = view('Loading...')
/** render new view */
const render = b => {
  el.className = "markdown-body animated fadeOut"
  setTimeout(_ => {
    window.scrollTo(0,0)
    morphdom(el,view(b))
  }, 100)
}

/** initial view appended */
document.body.appendChild(el)

/** load readme as root */
page('/', ctx => get('/index.md').then(render))
/** load any sub folder readme */
page('/:lesson', ctx => get('/' + ctx.params.lesson + '/index.md').then(render))
/** load any demo or exercise md */
page('/:lesson/:name', ctx => {
  get('/' + [ctx.params.lesson, ctx.params.name + '.md'].join('/')).then(b => {
    render(b)
    renderNotebook('.tonic')
    jsbinify()
  })
})
/** start local router */
page()

/** if first location is anything other than root then hot load */
if (window.location.pathname !== '/') page(window.location.pathname)
