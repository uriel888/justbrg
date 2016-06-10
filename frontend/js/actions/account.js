import { CALL_API } from '../middleware/api'
import {
  push
} from 'react-router-redux'
export const LOGIN_FAIL = 'LOGIN_FAIL'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_REQUEST = 'LOGIN_REQUEST'

function fetchUser(creds, dispatch) {
  return {
    [CALL_API]: {
      types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL],
      endpoint: `users/login`,
      body: creds,
      func: ()=>{
        dispatch(push('/'))
      },
      mode: 'api'
    }
  }
}


export function loadUser(creds) {
  return (dispatch, getState) => {
    return dispatch(fetchUser(creds, dispatch))
  }
}


export const REGISTER_FAIL = 'REGISTER_FAIL'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_REQUEST = 'REGISTER_REQUEST'

function postRegisterUser(creds, dispatch) {
  return {
    [CALL_API]: {
      types: [REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL],
      endpoint: `users/register`,
      body: creds,
      func: ()=>{
        dispatch(push('/'))
      },
      mode: 'api'
    }
  }
}


export function registerUser(creds) {
  if(creds.password.localeCompare(creds.repassword) != 0){
    return (dispatch) => {
      return dispatch({type: REGISTER_FAIL, error: "Password and re-enter password do not match!"})
    }
  }
  return (dispatch) => {
    return dispatch(postRegisterUser(creds, dispatch))
  }
}
