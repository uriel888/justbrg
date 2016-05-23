export function loginError(error) {
  return {
    error,
    type: 'LOGIN_FAIL'
  };
}

// You'll have a side effect here so (dispatch) => {} form is a good idea
export function loginSuccess(response) {
  return dispatch => {
    dispatch({
      response,
      type: 'LOGIN_SUCCESS'
    });
    // router.transitionTo('/dashboard');
  };
}

export function loginRequest(email, password) {
  const user = {
    email: email,
    password: password
  };
  return {
    user,
    type: 'LOGIN_REQUEST'
  };
}
