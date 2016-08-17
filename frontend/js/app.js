import React from 'react';
import {
  render
} from 'react-dom';
import {
  Provider
} from 'react-redux';
import {
  browserHistory
} from 'react-router';
import {
  syncHistoryWithStore
} from 'react-router-redux'
import Root from './containers/Root'
import configureStore from './store/configureStore.js'
import injectTapEventPlugin from 'react-tap-event-plugin';

const app = document.getElementById('app');
const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)
injectTapEventPlugin();
render( < Root store = {
    store
  }
  history = {
    history
  }
  />,
  app);
