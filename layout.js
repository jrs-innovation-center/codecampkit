const marked = require('marked')

module.exports = content => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>CodeCampKit</title>
    <meta name="description" content="CodeCamp Kit Guide">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/github-markdown.css">
    <style>
      .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
      }
    </style>
  </head>
  <body>
    <main class="markdown-body">
      ${marked(content)}
    </main>
  </body>
</html>
`
