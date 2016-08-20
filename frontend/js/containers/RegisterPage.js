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

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

export default class RegisterPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      repassword: "",
      usernameErrorText: "",
      passwordErrorText: "",
      repasswordErrorText: ""
    }
    this.updateUsername = this.updateUsername.bind(this);
    this.updateRePassword = this.updateRePassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.isMatch = this.isMatch.bind(this);
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
    }else{
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
      if(!this.isMatch(password, this.state.repassword)){
        this.setState({
          repasswordErrorText: 'Your re-entered password doesn\'t match'
        });
      }
      this.setState({
        passwordErrorText: '',
        password: password
      });
    }
  }

  isMatch(password,repassword){
    return password.localeCompare(repassword)==0?true:false
  }
  updateRePassword(event, password){
    if(password == ''){
      this.setState({
        repasswordErrorText: "Required Field",
        repassword: password
      });
    }else if(!this.isMatch(this.state.password, password)){
      this.setState({
        repasswordErrorText: 'Your re-entered password doesn\'t match',
        repassword: password
      });
    }else{
      this.setState({
        repasswordErrorText: '',
        repassword: password
      });
    }
  }

  render() {
    const {
      isLoggedIn,
      dispatch,
      isFetching
    } = this.props

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

        <form onSubmit={(e)=>{
          e.preventDefault()
          let valid = true;
          let username = this.state.username;
          let password = this.state.password;
          let repassword = this.state.repassword;

          if(!this.validateEmail(username)){
            this.setState({
              usernameErrorText: "Not a valid email address",
            });
          }else if(username == ''){
            this.setState({
              usernameErrorText: "Required Field",
            });
          }


          if(password == ''){
            valid= false;
            this.setState({
              passwordErrorText: "Required Field",
              password: password
            });
          }

          if(repassword == ''){
            valid = false;
            this.setState({
              repasswordErrorText: "Required Field",
            });
          }else if(!this.isMatch(this.state.password, repassword)){
            valid = false;
            this.setState({
              repasswordErrorText: 'Your re-entered password doesn\'t match',
            });
          }
          if(valid){
            this.props.registerUser({username: username, password: password, repassword: repassword})
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
        <TextField
          ref= "repassword"
          floatingLabelText="Please re-enter your password here"
          inputStyle={textStyle}
          style={textFieldStyle}
          errorStyle = {errorStyle}
          errorText={this.state.repasswordErrorText}
          onChange={this.updateRePassword}
          type="password"
        />
          <div style={{display:'inline-block', margin:'15px'}}>
            {isFetching?<CircularProgress size={1.5} />:<FlatButton label="REGISTER" type="submit" backgroundColor='rgba(188,187,169,0.4)'  labelStyle={textStyle}/>}
          </div>
        </form>
      </div>
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
