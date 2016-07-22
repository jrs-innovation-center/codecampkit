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

/** get header and footer */
var h = 'CodeCamp KIT'
var f = 'All Rights Reserved...'

get('/header.md').then(function (header) { return h = header; })
get('/footer.md').then(function (footer) {
    f = /File Not Found/.test(footer) ? f : footer
})

/** create view */
var view = function (b) { return domify(("\n  <div id=\"app\" class=\"animated fadeIn\">\n    <header>" + (marked(h)) + "</header>\n    <div class=\"markdown-body\">" + (marked(b)) + "</div>\n    <footer>" + (marked(f)) + "</footer>\n  </div>\n")); }


/** default view */
var el = view('Loading...')
/** render new view */
var render = function (b, cb) {
  el.className = "animated fadeOut"
  setTimeout(function (_) {
    window.scrollTo(0,0)
    morphdom(el,view(b))
    if (cb) cb()
  }, 250)
}

var renderAll = function (b) { return render(b, function (_) {
  // TODO: create plugins
  renderNotebook('.tonic')
  jsbinify()
}); }

/** initial view appended */
document.body.appendChild(el)

/** load readme as root */
page('/', function (ctx) { return get('/index.md').then(renderAll); })
/** load any sub folder readme */
page('/:lesson', function (ctx) { return get('/' + ctx.params.lesson + '/index.md')
  .then(renderAll); })
/** load any demo or exercise md */
page('/:lesson/:name', function (ctx) {
  get('/' + [ctx.params.lesson, ctx.params.name + '.md'].join('/'))
    .then(renderAll)
})
/** start local router */
page()

/** if first location is anything other than root then hot load */
if (window.location.pathname !== '/') page(window.location.pathname)
