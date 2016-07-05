/**
 * simple xhr promise module
 *
 * used to dynamically serve markdown files
 */
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
