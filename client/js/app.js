/**
 * import external modules
 */
var domify = require('domify')
var marked = require('marked')
var page = require('page')
var morphdom = require('morphdom')

/**
 * get handles xhr get requests
 */
var get = require('js:get')

/**
 * searches and processes any tonic code blocks
 *
 * <div class="tonic">
 *  <pre><code>
 *    console.log('Hello World')
 *  </code></pre>
 * </div>
 */
var renderNotebook = require('js:notebook')

/**
 * embeds jsbin projects
 *
 * <a class="jsbin-embed foo" href="http://jsbin.com/iwovaj/74/embed?js,output">
 *  Simple Animation Tests</a>
 */
var jsbinify = require('js:jsbinify')

/** create view */
var view = function (b) { return domify('<div id="app" class="markdown-body animated fadeIn">' + marked(b) + '</div>'); }
/** default view */
var el = view('Loading...')
/** render new view */
var render = function (b) {
  el.className = "markdown-body animated fadeOut"
  setTimeout(function (_) {
    window.scrollTo(0,0)
    morphdom(el,view(b))
  }, 100)
}

/** initial view appended */
document.body.appendChild(el)

/** load readme as root */
page('/', function (ctx) { return get('/index.md').then(render); })
/** load any sub folder readme */
page('/:lesson', function (ctx) { return get('/' + ctx.params.lesson + '/index.md').then(render); })
/** load any demo or exercise md */
page('/:lesson/:name', function (ctx) {
  get('/' + [ctx.params.lesson, ctx.params.name + '.md'].join('/')).then(function (b) {
    render(b)
    renderNotebook('.tonic')
    jsbinify()
  })
})
/** start local router */
page()

/** if first location is anything other than root then hot load */
if (window.location.pathname !== '/') page(window.location.pathname)
