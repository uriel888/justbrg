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
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

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
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      usernameErrorText: "",
      passwordErrorText: ""
    }
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }

  updateUsername(event, username){
    if(!this.validateEmail(username)){
      this.setState({
        username: username,
        usernameErrorText: "Not a valid email address",
      });
    }else if(username == ''){
      this.setState({
        usernameErrorText: "Required Field",
      });
    }
    else{
      this.setState({
        username: username,
        usernameErrorText: ""
      });
    }
  }

  updatePassword(event, password){
    if(password == ''){
      this.setState({
        passwordErrorText: "Required Field",
        password: password
      });
    }else{
      this.setState({
        passwordErrorText: '',
        password: password
      });
    }
  }

  render() {
    const {
      isLoggedIn,
      error,
      isFetching,
      dispatch
    } = this.props
    let loadUserCreater = bindActionCreators(loadUser, dispatch)

    const textFieldStyle = {
      autocomplete: {
        width: 400,
      },
      display:'inline-block',
      margin:'15px',
    }
    const textStyle = {
      fontSize: 25,
    }
    const errorStyle ={
      display:'table',
    }
    return (
      <div style={{textAlign:'center'}}>
      <form autoComplete="off" onSubmit={(e)=>{
        e.preventDefault()
        let username = this.state.username
        let password = this.state.password
        let valid = true

        if(!this.validateEmail(username)){
          valid =false
          this.setState({
            usernameErrorText: "Not a valid email address",
          });
        }else if(username == ''){
          valid =false
          this.setState({
            usernameErrorText: "Required Field",
          });
        }

        if(password == ''){
          valid = false
          this.setState({
            passwordErrorText: "Required Field",
          });
        }
        if(valid){
          loadUserCreater({username: this.state.username, password: this.state.password})
        }
      }}>

        <TextField
          ref= "email"
          inputStyle={textStyle}
          floatingLabelText="Please type your login email here"
          style={textFieldStyle}
          errorStyle = {errorStyle}
          errorText={this.state.usernameErrorText}
          onChange={this.updateUsername}
        />
        <TextField
          ref= "password"
          floatingLabelText="Please type your password here"
          inputStyle={textStyle}
          style={textFieldStyle}
          errorStyle = {errorStyle}
          errorText={this.state.passwordErrorText}
          onChange={this.updatePassword}
          type="password"
        />
        <div style={{position:'fixed', display:'inline-block', margin:'15px'}}>
          {isFetching?<CircularProgress />:<RaisedButton label="LOGIN" type="submit" primary={true} labelStyle={textStyle}/>}
        </div>
      </form>

      </div>
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
