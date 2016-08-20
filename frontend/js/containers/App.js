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
import AlertDialog from '../components/AlertDialog'

import { search } from '../actions/search'
import { verifyUser, logoutUser } from '../actions/account'


import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import { StickyContainer, Sticky } from 'react-sticky';

const mapStateToProps = (
  state
) => {
  return {
    isFetching: state.account.isFetching,
    isLoggedIn: state.account.isAuthenticated,
    generalFetching: state.search.generalFetching,
    candidate: state.autocomplete.candidate,
    error: state.account.error?state.account.error:state.search.error
  }
}




export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topColor : 'transparent'
    }
    this.handleScroll = this.handleScroll.bind(this);

  }

  handleScroll(event) {
      let scrollTop = event.srcElement.body.scrollTop,
          itemTranslate = Math.min(0, scrollTop/3 - 60);
      let topDistance = document.body.scrollTop

      if (topDistance <= 0) {
        this.setState({
          topColor : 'transparent'
        });
      }else{
        this.setState({
          topColor : 'rgba(245 ,245,245,0.99)'
        });
      }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillMount(){
    const {dispatch, isLoggedIn} = this.props
    const backgoundStyle = {
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundImage: 'url(/static/img/BACKGROUND.jpg)',
    }
    let verifyUserCreater = bindActionCreators(verifyUser, dispatch)
    if(isLoggedIn){
      verifyUserCreater()
    }
    window.removeEventListener('scroll', this.handleScroll);
    document.body.style.backgroundImage = backgoundStyle.backgroundImage;
    document.body.style.backgroundAttachment = backgoundStyle.backgroundAttachment;
    document.body.style.backgroundSize = backgoundStyle.backgroundSize;
    document.body.style.backgroundRepeat = backgoundStyle.backgroundRepeat;
  }
  render() {
    const {
      isLoggedIn,
      generalFetching,
      dispatch,
      isFetching,
      candidate,
      error
    } = this.props

    const {
      query
    } = this.props.location

    const barStyle = {
      backgroundColor: "transparent",
    };

    const titleStyle = {
      color: "black"
    }

    const wholeTopStyle = {
      backgroundColor: this.state.topColor,
    }
    let searchCreater = bindActionCreators(search, dispatch)
    let logoutUserCreater = bindActionCreators(logoutUser, dispatch)
    let versionError = "";
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      versionError = 'This website is currently not mobile friendly, but you can still use it without any issues. IOS version will be in development!'
    } else if (/(Android)/i.test(navigator.userAgent)) {
      versionError = 'This website is currently not mobile friendly, but you can still use it without any issues. Android version will be in development!'
    }
    return (
      <MuiThemeProvider>
      {
        isLoggedIn?(
          <StickyContainer>
            <Sticky style={{zIndex: 1000}}>
              <div style={wholeTopStyle}>
                <AppBar
                  title="JustBRG"
                  style={barStyle}
                  titleStyle={titleStyle}
                  showMenuIconButton={false}
                  iconElementRight={isLoggedIn ? (isFetching?(<CircularProgress size='0.5'/>):<ProfileMenuButton logoutUser={logoutUserCreater} />) : <Login_Register_Buttons /> }
                />
                <Searchbox searchButtonClick={searchCreater} query={query} generalFetching={generalFetching} candidate={candidate} dispatch={dispatch}/>
              </div>
            </Sticky>
              {error?<AlertDialog message={error} />:false}
              {this.props.children}
          </StickyContainer>
        ):(
          <StickyContainer>
            <Sticky style={{zIndex: 1000}}>
              <div style={wholeTopStyle}>
                <AppBar
                  title="JustBRG"
                  style={barStyle}
                  titleStyle={titleStyle}
                  showMenuIconButton={false}
                  iconElementRight={isLoggedIn ? (isFetching?(<CircularProgress size='0.5'/>):<ProfileMenuButton logoutUser={logoutUserCreater} />) : <Login_Register_Buttons /> }
                />
                </div>
                </Sticky>
                <FreshEntry />
                {versionError!=""?<AlertDialog message={versionError} />:false}
                {error?<AlertDialog message={error} />:false}
              {this.props.children}
          </StickyContainer>
        )
      }

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
