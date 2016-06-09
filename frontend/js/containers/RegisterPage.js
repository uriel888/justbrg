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

import { registerUser } from '../actions/account'

const mapStateToProps = (
  state
) => {
  return {
    isLoggedIn: state.account.isAuthenticated,
    isFetching: state.account.isFetching
  }
}


export default class RegisterPage extends Component {
  render() {
    const {
      isLoggedIn,
      dispatch,
      isFetching
    } = this.props
    return (
      <form onSubmit={(e)=>{
        e.preventDefault()
        this.props.registerUser({username: this.refs.email.value, password: this.refs.pass.value, repassword: this.refs.repass.value})
      }}>
        <label>{isFetching?<i className="fa fa-spinner fa-spin" style={{"fontSize":"24px"}}></i>:false}</label><br />
        <label><input ref="email" placeholder="email" defaultValue="just@brg.it" /></label>
        <label><input type="password" ref="pass" placeholder="password" /></label>
        <label><input type="password" ref="repass" placeholder="re-enter password" /></label><br />
        <button type="submit">login</button>
      </form>
    )
    }
  }

  RegisterPage.propTypes = {
    // Injected by React Redux
    isLoggedIn:  React.PropTypes.bool,

    // Injected by React Router
    children: PropTypes.node
  }
  // export default connect(mapStateToProps, dispatch => {return {dispatch}})(LoginPage)

  export default connect(mapStateToProps, {registerUser})(RegisterPage)
