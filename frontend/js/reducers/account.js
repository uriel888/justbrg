import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from '../actions/account.js'
const initialState = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('email') ? true : false,
  error: "",
  email: ""
}

const account = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        error: "",
        email: action.body.username
      })
    case LOGIN_SUCCESS:
      localStorage.setItem('email', state.email)
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        error: ""
      })
    case LOGIN_FAIL:
      alert(action.error);
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        error: action.error
      })
    case REGISTER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        error: "",
        email: action.body.username
      })
    case REGISTER_SUCCESS:
      localStorage.setItem('email', state.email)
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        error: ""
      })
    case REGISTER_FAIL:
      alert(action.error);
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
