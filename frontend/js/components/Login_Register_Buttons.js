import React, {
  Component
} from 'react'

import {
  Link
} from 'react-router'

import FlatButton from 'material-ui/FlatButton';

export default class Login_Register_Buttons extends Component {
  render() {
    const buttonStyle = {
      margin: '5px',
    };
    const labelStyle = {
      fontSize: 18,
      fontWeight: 900
    }
    return (
      <div style={buttonStyle}>
        <FlatButton label="Login" labelStyle={labelStyle}  containerElement={<Link to="/login" />} />
        <FlatButton label="Register" labelStyle={labelStyle}  containerElement={<Link to="/register" />} />
      </div>
    );
  }
}
