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
    Tonic.createNotebook({ element: element, source: element.innerText })
  }
  return element
}
/** hide pre block */
const hideText = element => {
  // var pre = element.querySelector('pre')
  // if (pre) {
  //   set(lensPath(['style','display']), 'none', pre)
  // }
  element.innerText = ''

  return element
}

/** compose create and hidePre */
const process = compose(hideText, create)

/** export module */
module.exports = _ => compose(map(process),selectors)('.tonic')
