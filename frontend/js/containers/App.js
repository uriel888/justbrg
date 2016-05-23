import React, {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  browserHistory
} from 'react-router'



const mapStateToProps = (
  state
) => {
  return {
    isLoggedIn: state.account.isAuthenticated
  }
}


export default class App extends Component {
  render() {
    const {
      isLoggedIn
    } = this.props
    console.log(isLoggedIn);
    return ( < div >
        {isLoggedIn?"loggedin":"not loggedin"}
       < /div>)
    }
  }

  App.propTypes = {
    // Injected by React Redux
    isLoggedIn: PropTypes.boolean,

    // Injected by React Router
    children: PropTypes.node
  }
  export default connect(mapStateToProps)(App)
