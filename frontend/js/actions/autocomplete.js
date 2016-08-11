import { CALL_API } from '../middleware/api'

export const AUTOCOMPLETE_FAIL = 'AUTOCOMPLETE_FAIL'
export const AUTOCOMPLETE_SUCCESS = 'AUTOCOMPLETE_SUCCESS'
export const AUTOCOMPLETE_REQUEST = 'AUTOCOMPLETE_REQUEST'


function fetchCandidateData(hint) {
  return {
    [CALL_API]: {
      types: [AUTOCOMPLETE_REQUEST, AUTOCOMPLETE_SUCCESS, AUTOCOMPLETE_FAIL],
      endpoint: `autoComplete`,
      body: hint,
      mode: 'autocomplete'
    }
  }
}

export function fetchCandidate(hint) {
  return (dispatch, getState) => {
    return dispatch(fetchCandidateData(hint))
  }
}
