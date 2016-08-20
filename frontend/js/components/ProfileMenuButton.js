import React, {
  Component
} from 'react'

import {
  Link
} from 'react-router'

import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

export default class ProfileMenuButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openMenu: false
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOpenMenu(){
    this.setState({
      openMenu: true,
    });
  }

  handleOnRequestChange(value){
    this.setState({
      openMenu: value,
    });
  }

  handleOnChange(event, purpose){
    if(purpose == 'logout'){
      this.props.logoutUser()
    }
  }

  render() {
    const buttonStyle = {
      margin: '5px',
    };
    const labelStyle = {
      fontSize: 18,
      fontWeight: 900,
      backgroundColor: 'transparent',
    };

    return (
      <div style={buttonStyle} >
      <IconMenu
        iconButtonElement={<FlatButton labelStyle={labelStyle} onTouchTap={this.handleOpenMenu} label="Settings" />}
        open={this.state.openMenu}
        onChange={this.handleOnChange}
        onRequestChange={this.handleOnRequestChange}
        menuStyle = {{backgroundColor:'transparent'}}
      >
        <MenuItem value="logout" style={labelStyle} primaryText="Logout" />
      </IconMenu>
      </div>
    );
  }
}
