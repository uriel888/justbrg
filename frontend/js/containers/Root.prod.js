import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import createRoutes from '../routes';
import { Router } from 'react-router'

export default class Root extends Component {
  render() {
    const { store, history } = this.props
    const routes = createRoutes(store);
    return (
      <Provider store={store}>
        <Router history={history}>
        {routes}
        </Router>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}
