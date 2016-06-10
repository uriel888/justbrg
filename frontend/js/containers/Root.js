// if (process.env.NODE_ENV === 'production') {
//   module.exports = require('./Root.prod')
// } else {
//   module.exports = require('./Root.dev')
// }

import * as master from '../../configs/master.json'
if (master.Status === 'dev') {
  module.exports = require('./Root.dev')
} else {
  module.exports = require('./Root.prod')
}
