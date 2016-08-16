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

import { bindActionCreators } from 'redux'

import Searchbox from '../components/Searchbox'
import FreshEntry from '../components/FreshEntry'
import Login_Register_Buttons from '../components/Login_Register_Buttons'
import ProfileMenuButton from '../components/ProfileMenuButton'
import { search } from '../actions/search'
import { logoutUser } from '../actions/account'


import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';


const mapStateToProps = (
  state
) => {
  return {
    isFetching: state.account.isFetching,
    isLoggedIn: state.account.isAuthenticated,
    generalFetching: state.search.generalFetching,
    candidate: state.autocomplete.candidate
  }
}




export default class App extends Component {
  render() {
    const {
      isLoggedIn,
      generalFetching,
      dispatch,
      isFetching,
      candidate
    } = this.props

    const {
      query
    } = this.props.location

    const barStyle = {
      backgroundColor: "black",
    };

    const titleStyle = {
      color: "#D3D3D3"
    }

    let searchCreater = bindActionCreators(search, dispatch)
    let logoutUserCreater = bindActionCreators(logoutUser, dispatch)

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="JustBRG"
            style={barStyle}
            titleStyle={titleStyle}
            showMenuIconButton={false}
            iconElementRight={isLoggedIn ? (isFetching?(<CircularProgress size='0.5'/>):<ProfileMenuButton logoutUser={logoutUserCreater} />) : <Login_Register_Buttons /> }
          />
          {isLoggedIn?<Searchbox searchButtonClick={searchCreater} query={query} generalFetching={generalFetching} candidate={candidate} dispatch={dispatch}/>:<FreshEntry />}
          {this.props.children}
        </div>
      </MuiThemeProvider>
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
