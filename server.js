const http = require('http')
const ecstatic = require('ecstatic')
const HttpHashRouter = require('http-hash-router')
const sendError = require('send-data/error')
const sendHtml = require('send-data/html')
const sendJS = fn => (req, res) => {
  res.writeHead(200, {
    'content-type': 'text/javascript',
    'Cache-Control': '3600'
  })
  res.end(fn())
}

const router = HttpHashRouter()

router.set('/', (req, res) => sendHtml(req, res, index()))
router.set('/config.js', sendJS(configJs))
router.set('/app.js', sendJS(appJs))
router.set('/get.js', sendJS(getJs))
router.set('/jsbinify.js', sendJS(jsbinifyJs))
router.set('/notebook.js', sendJS(notebookJs))

router.set('*', (req, res) => ecstatic({
  root: process.cwd(),
  handleError: false,
  showDir: false,
  cache: 0
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
const jsbinify = require('./jsbinify.js')

const view = b => domify('<div id="app" class="markdown-body">' + marked(b) + '</div>')
const el = view('Loading...')
const render = b => {
  morphdom(el,view(b))
  window.scrollTo(0,0)
}

document.body.appendChild(el)

page('/', ctx => get('/README.md').then(render))
page('/:lesson', ctx => get('/' + ctx.params.lesson + '/README.md').then(render))
page('/:lesson/:name', ctx => {
  get('/' + [ctx.params.lesson, ctx.params.name + '.md'].join('/')).then(b => {
    render(b)
    renderNotebook('.tonic')
    jsbinify()
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

function jsbinifyJs() {
  return `
  module.exports = function () {

  (function (window, document, undefined) {
    'use strict';
    var addEventListener = window.addEventListener ? 'addEventListener' : 'attachEvent';

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    // MIT license
    (function () {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function () { callback(currTime + timeToCall); },
            timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }

      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
          clearTimeout(id);
        };
      }
    }());

    // exit if we already have a script in place doing this task
    if (window.jsbinified !== undefined) {
      return;
    }

    // flag to say we don't need this script again
    //window.jsbinified = true;

    /*!
      * domready (c) Dustin Diaz 2012 - License MIT
      */
    var domready = (function domready() {
      var fns = [],
          listener,
          doc = document,
          hack = doc.documentElement.doScroll,
          domContentLoaded = 'DOMContentLoaded',
          loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);


      if (!loaded) {
        doc.addEventListener(domContentLoaded, listener = function () {
          doc.removeEventListener(domContentLoaded, listener);
          loaded = 1;
          while (listener = fns.shift()) { // jshint ignore:line
            listener();
          }
        });
      }

      return function (fn) {
        if (loaded) {
          setTimeout(fn, 0);
        } else {
          fns.push(fn);
        }
      };
    })();

    function getQuery(querystring) {
      var query = {};

      var pairs = querystring.split('&'),
          length = pairs.length,
          keyval = [],
          i = 0;

      for (; i < length; i++) {
        keyval = pairs[i].split('=', 2);
        try {
          keyval[0] = decodeURIComponent(keyval[0]); // key
          keyval[1] = decodeURIComponent(keyval[1]); // value
        } catch (e) {}

        if (query[keyval[0]] === undefined) {
          query[keyval[0]] = keyval[1];
        } else {
          query[keyval[0]] += ',' + keyval[1];
        }
      }

      return query;
    }


    // ---- here begins the jsbin embed - based on the embedding doc: https://github.com/jsbin/jsbin/blob/master/docs/embedding.md

    var innerText = document.createElement('i').innerText === undefined ? 'textContent' : 'innerText';

    // 1. find all links with class=jsbin
    function getLinks() {
      var links = [], alllinks, i = 0, length;
      alllinks = document.getElementsByTagName('a');
      length = alllinks.length;
      for (; i < length; i++) {
        if ((' ' + alllinks[i].className).indexOf(' jsbin-') !== -1) {
          links.push(alllinks[i]);
        }
      }

      return links;
    }

    function findCodeInParent(element) {
      var match = element;

      while (match = match.previousSibling) { // jshint ignore:line
        if (match.nodeName === 'PRE') {
          break;
        }
        if (match.getElementsByTagName) {
          match = match.getElementsByTagName('pre');
          if (match.length) {
            match = match[0]; // only grabs the first
            break;
          }
        }
      }

      if (match) {
        return match;
      }

      match = element.parentNode.getElementsByTagName('pre');

      if (!match.length) {
        if (element.parentNode) {
          return findCodeInParent(element.parentNode);
        } else {
          return null;
        }
      }

      return match[0];
    }

    function findCode(link) {
      var rel = link.rel,
          element,
          code;

      if (rel && (element = document.getElementById(rel.substring(1)))) {
        code = element[innerText];
      // else - try to support multiple targets for each panel...
      // } else if (query.indexOf('=') !== -1) {
      //   // assumes one of the panels points to an ID
      //   query.replace(/([^,=]*)=([^,=]*)/g, function (all, key, value) {
      //     code = document.getElementById(value.substring(1))[innerText];

      //   });
      } else {
        // go looking through it's parents
        element = findCodeInParent(link);
        if (element) {
          code = element[innerText];
        }
      }

      return code;
    }

    function detectLanguage(code) {
      var htmlcount = (code.split('<').length - 1),
          csscount = (code.split('{').length - 1),
          jscount = (code.split('.').length - 1);

      if (htmlcount > csscount && htmlcount > jscount) {
        return 'html';
      } else if (csscount > htmlcount && csscount > jscount) {
        return 'css';
      } else {
        return 'javascript';
      }
    }

    function scoop(link) {
      var code = findCode(link),
          language = detectLanguage(code),
          query = link.search.substring(1);

      if (language === 'html' && code.toLowerCase().indexOf('<html') === -1) {
        // assume this is an HTML fragment - so try to insert in the %code% position
        language = 'code';
      }

      if (query.indexOf(language) === -1) {
        query += ',' + language + '=' + encodeURIComponent(code);
      } else {
        query = query.replace(language, language + '=' + encodeURIComponent(code));
      }

      link.search = '?' + query;
    }

    function hookMessaging(iframe) {
      var onmessage = function (event) {
        if (!event) { event = window.event; }
        // * 1 to coerse to number, and + 2 to compensate for border
        iframe.style.height = (event.data.height * 1 + 2) + 'px';
      };

      window[addEventListener]('message', onmessage);
    }

    function loadRealEmbed(iframe) {
      var clone = iframe.cloneNode();
      var url = clone.getAttribute('data-url');

      clone.src = url.split('&')[0];
      clone._src = url.split('&')[0]; // support for google slide embed
      iframe.parentNode.replaceChild(clone, iframe);
      hookMessaging(clone);
    }

    function embed(link) {
      var iframe = document.createElement('iframe');
      var url = link.href.replace(/edit/, 'embed');

      iframe.className = link.className; // inherit all the classes from the link
      iframe.id = link.id; // also inherit, giving more style control to the user
      iframe.style.border = '1px solid #aaa';

      var query = getQuery(link.search);
      iframe.style.width = query.width || '100%';
      iframe.style.minHeight = query.height || '300px';
      if (query.height) {
        iframe.style.maxHeight = query.height;
      }

      // track when it comes into view and reload
      if (inview(link, 100)) {
        // the iframe is full view, let's render it
        iframe.src = url.split('&')[0];
        iframe._src = url.split('&')[0]; // support for google slide embed
        hookMessaging(iframe);
      } else {
        iframe.setAttribute('data-url', url);
        iframe.src = 'https://jsbin.com/embed-holding';

        pending.push(iframe);
      }

      link.parentNode.replaceChild(iframe, link);
    }

    function readLinks() {
      var links = getLinks(),
          i = 0,
          length = links.length,
          className = '';

      for (; i < length; i++) {
        className = ' ' + links[i].className + ' ';
        if (className.indexOf(' jsbin-scoop ') !== -1) {
          scoop(links[i]);
        } else if (className.indexOf(' jsbin-embed ') !== -1) {
          links[i].className = links[i].className.replace(/jsbin\-embed/, '');
          embed(links[i]);
        }
      }
    }

    var docElem = document && document.documentElement;

    function viewportW() {
      var a = docElem.clientWidth;
      var b = window.innerWidth;
      return a < b ? b : a;
    }

    function viewportH() {
      var a = docElem.clientHeight;
      var b = window.innerHeight;
      return a < b ? a : b;
    }

    function calibrate(coords, cushion) {
      var o = {};
      cushion = +cushion || 0;
      o.width = (o.right = coords.right + cushion) - (o.left = coords.left - cushion);
      o.height = (o.bottom = coords.bottom + cushion) - (o.top = coords.top - cushion);
      return o;
    }

    function inview(el, cushion) {
      var r = calibrate(el.getBoundingClientRect(), cushion);
      return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
    }

    function checkForPending() {
      var i = 0;
      var todo = [];
      for (i = 0; i < pending.length; i++) {
        if (inview(pending[i], 400)) {
          todo.unshift({ iframe: pending[i], i: i });
        }
      }

      for (i = 0; i < todo.length; i++) {
        pending.splice(todo[i].i, 1);
        loadRealEmbed(todo[i].iframe);
      }
    }

    var pending = [];

    // this supports early embeding - probably only applies to Google's slides.js
    readLinks();

    // try to read more links once the DOM is done
    domready(function () {
      readLinks();
      var id = null;
      function handler() {
        if (pending.length) {
          cancelAnimationFrame(id);
          id = requestAnimationFrame(checkForPending);
        } else {
          // detatch the scroll handler
        }
      }
      docElem[addEventListener]('scroll', handler, true);
      window[addEventListener]('scroll', handler, true);
    });

  }(this, document));
}
  `
}
