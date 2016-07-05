/**
 * converts any div with a class name of tonic
 * into a tonic code executable code block
 *
 */

/** get functional helpers */
const { compose, map } = require('ramda')

/** get selectors */
const selectors = s => document.querySelectorAll(s)
/** create notebook */
const create = element => {
  if (Tonic) {
    var code = element.innerText
    element.innerText = ''
    Tonic.createNotebook({ element: element, source: code })
  }
  return element
}

/** export module */
module.exports = _ => compose(map(create),selectors)('.tonic')
