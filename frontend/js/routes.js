import React from 'react'
import { Route } from 'react-router'
import App from './containers/App'
import LoginPage from './containers/LoginPage'
import RegisterPage from './containers/RegisterPage'
import SearchPage from './containers/SearchPage'
import ReactGA from 'react-ga'

ReactGA.initialize('UA-81192750-1');
function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}
// import UserPage from './containers/UserPage'
// import RepoPage from './containers/RepoPage'

export default(store) =>{
  const redirectAuth = (nextState, replace, callback) => {
    const isAuthenticated = store.getState().account.isAuthenticated;
    if (isAuthenticated) {
      replace({
        pathname: '/'
      });
    }
    callback();
  };

  const requireAuth = (nextState, replace, callback) => {
    const isAuthenticated = store.getState().account.isAuthenticated;
    if (!isAuthenticated) {
      replace({
        pathname: '/login',
        state: {
          nextPathname: nextState.location.pathname
        }
      });
    }
    callback();
  };


  return (
    <Route path="/" onUpdate={logPageView} component={App}>
      <Route path="/register" onUpdate={logPageView} component={RegisterPage} onEnter={redirectAuth}/>
      <Route path="/login" onUpdate={logPageView} component={LoginPage} onEnter={redirectAuth} />
      <Route path="/search" onUpdate={logPageView} component={SearchPage} onEnter={requireAuth}/>
    </Route>
  )
}

// export default (
//   <Route path="/" component={App} />
//   <Route path="/login" component={LoginPage} />
// )
