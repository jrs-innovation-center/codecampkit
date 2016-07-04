/**
 * converts any div with a class name of tonic
 * into a tonic code executable code block
 *
 */

/** get functional helpers */
const { compose, map, set, lensPath } = require('ramda')

/** get selectors */
const selectors = s => document.querySelectorAll(s)
/** create notebook */
const create = element => {
  if (Tonic) {
    Tonic.createNotebook({ element: element, source: element.innerText })
  }
  return element
}
/** hide pre block */
const hidePre = element => {
  var pre = element.querySelector('pre')
  if (pre) {
    set(lensPath(['style','display']), 'none', pre)
  }

  return element
}

/** compose create and hidePre */
const process = compose(hidePre, create)

/** export module */
module.exports = _ => compose(map(process),selectors)('.tonic')
