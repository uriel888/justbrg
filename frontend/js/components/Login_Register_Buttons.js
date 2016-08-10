import React, {
  Component,
  PropTypes
} from 'react'

import {
  Link
} from 'react-router'

import RaisedButton from 'material-ui/RaisedButton';

export default class Login_Register_Buttons extends Component {
  render() {
    return (
      <span>
        <RaisedButton label="Login" containerElement={<Link to="/login" />} />
        <RaisedButton label="Register" containerElement={<Link to="/register" />} />
      </span>
    );
  }
}
