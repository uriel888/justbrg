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
import MainPage from './containers/App.js'
import configureStore from './store/configureStore.js'


const app = document.getElementById('app');
const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)
render( < Root store = {
    store
  }
  history = {
    history
  }
  />,
  app);
