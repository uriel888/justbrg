import {
  AUTOCOMPLETE_REQUEST,
  AUTOCOMPLETE_SUCCESS,
  AUTOCOMPLETE_FAIL
} from '../actions/autocomplete.js'

const initialState = {
  candidate: []
}

const autocomplete = (state = initialState, action) => {
  switch (action.type) {
    case AUTOCOMPLETE_SUCCESS:
      return Object.assign({}, state, {
        candidate: action.response
      })
    case AUTOCOMPLETE_FAIL:
      return Object.assign({}, state, {
        candidate: []
      })
    default:
      return state
  }
}


export default autocomplete
