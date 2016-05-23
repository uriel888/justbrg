import cookie from 'react-cookie';
const initialState = {
  isFetching: false,
  isAuthenticated: cookie.load('userId') ? true : false,
  errorMessage: ""
}

const account = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      })
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        error: ""
      })
    case 'LOGIN_FAIL':
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        error: action.error
      })
    default:
      return state
  }
}

export default account
