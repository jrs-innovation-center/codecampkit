/**
 * SystemJS Config
 *
 */
/** turn off default extensions to use wzrd.in */
System.defaultJSExtensions = false
  /** setup default paths */
System.config({
  paths: {
    "js:*": "/js/*.js",
    "*": "https://wzrd.in/standalone/*"
  }
})
