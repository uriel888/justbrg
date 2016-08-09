import React, {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  browserHistory,
  Link
} from 'react-router'
import { bindActionCreators } from 'redux'

import Searchbox from '../components/Searchbox'
import FreshEntry from './FreshEntry'
import { search } from '../actions/search'

const mapStateToProps = (
  state
) => {
  return {
    isLoggedIn: state.account.isAuthenticated,
    generalFetching: state.search.generalFetching
  }
}




export default class App extends Component {
  render() {
    const {
      isLoggedIn,
      generalFetching,
      dispatch
    } = this.props

    const {
      query
    } = this.props.location
    let searchCreater = bindActionCreators(search, dispatch)
    return (
      < div >
        {isLoggedIn?<Searchbox searchButtonClick={searchCreater} query={query} generalFetching={generalFetching} dispatch={dispatch}/>:<FreshEntry />}
        {this.props.children}
      < /div>
    )
    }
  }

  App.propTypes = {
    // Injected by React Redux
    isLoggedIn:  React.PropTypes.bool,

    // Injected by React Router
    children: PropTypes.node
  }
  export default connect(mapStateToProps)(App)
