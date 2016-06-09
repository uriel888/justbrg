import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
// import routes from '../routes'
import createRoutes from '../routes';
import DevTools from './DevTools'
import { Router } from 'react-router'

export default class Root extends Component {
  render() {
    const { store, history } = this.props
    const routes = createRoutes(store);
    return (
      <Provider store={store}>
        <Router history={history}>
        {routes}
        <DevTools />
        </Router>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}
