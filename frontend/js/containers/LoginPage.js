import React, {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  push
} from 'react-router-redux'

import { loadUser } from '../actions/account'
import { bindActionCreators } from 'redux'

const mapStateToProps = (
  state
) => {
  return {
    isLoggedIn: state.account.isAuthenticated,
    error: state.account.error,
    isFetching: state.account.isFetching
  }
}


export default class LoginPage extends Component {
  render() {
    const {
      isLoggedIn,
      error,
      isFetching,
      dispatch
    } = this.props
    let loadUserCreater = bindActionCreators(loadUser, dispatch)
    return (
      <form onSubmit={(e)=>{
        e.preventDefault()
        loadUserCreater({username: this.refs.email.value, password: this.refs.pass.value})
      }}>
        <label>{isFetching?<i className="fa fa-spinner fa-spin" style={{"fontSize":"24px"}}></i>:false}</label><br />
        <label><input ref="email" placeholder="email" defaultValue="just@brg.it" /></label>
        <label><input type="password" ref="pass" placeholder="password" /></label><br />
        <button type="submit">login</button>
      </form>
    )
    }
  }

  LoginPage.propTypes = {
    // Injected by React Redux
    isLoggedIn:  React.PropTypes.bool,

    // Injected by React Router
    children: PropTypes.node
  }
  // export default connect(mapStateToProps, dispatch => {return {dispatch}})(LoginPage)

  export default connect(mapStateToProps)(LoginPage)
