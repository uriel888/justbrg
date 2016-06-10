import * as master from '../../configs/master.json'
if (master.Status === 'dev') {
  module.exports = require('./configureStore.dev')
} else {
  module.exports = require('./configureStore.prod')
}
