import React, {
  Component,
  PropTypes
} from 'react'

import {
  Link
} from 'react-router'

import FlatButton from 'material-ui/FlatButton';

export default class Login_Register_Buttons extends Component {
  render() {
    const buttonStyle = {
      margin: '5',
    };
    const labelStyle = {
      color: "#D3D3D3",
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
