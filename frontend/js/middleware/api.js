import * as master from '../../configs/master.json'
import 'isomorphic-fetch'

let API_ROOT = ""
let CRAWLER_ROOT = ""
if (master.Status == 'dev') {
  API_ROOT = master.dev_api_address
  CRAWLER_ROOT = master.dev_crawler_address
} else {
  API_ROOT = master.prod_api_address
  CRAWLER_ROOT = master.prod_crawler_address
}

function callApiwithPost(endpoint, body, func, mode) {
  let method = 'POST'
  let fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  if (mode == "crawler") {
    fullUrl = (endpoint.indexOf(CRAWLER_ROOT) === -1) ? CRAWLER_ROOT + endpoint : endpoint
    fullUrl += body
    method = 'GET'
    body = undefined
  } else if (mode == 'compete') {
    fullUrl = endpoint
    method = 'GET'
    body = undefined
    headers = undefined
  }
  return fetch(fullUrl, {
      method: method,
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(body)
    })
    .then((response) => {
      if (mode == 'compete') {
        return response.text().then(json => ({
          json,
          response
        }))
      } else {
        return response.json().then(json => ({
          json,
          response
        }))
      }

    }).then(({
      json,
      response
    }) => {
      if (!response.ok && mode == 'compete') {
        return Promise.reject({message: json})
      }else if(!response.ok){
        return Promise.reject(json)
      }
      if (typeof func === 'function') {
        func()
      }

      if(mode == 'compete'){
        let html = json
        let el = document.createElement( 'html' );
        el.innerHTML = html
        let candidate = el.getElementsByTagName("span")[0];
        json = {competeRate: candidate.getAttribute('data-lowestrate'), competeURL: candidate.getAttribute('data-lowestrateredirection')}
        if(html.indexOf(" No prices found for your travel dates") >= 0){
          json.competeRate="9999"
          json.competeURL="NOURL"
        }
        if(json.competeRate == "" && json.competeURL == ""){
          return Promise.reject( {message: "LOADING"})
        }
      }
      return json
    })
}


export const CALL_API = Symbol('Call API')

export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let {
    endpoint,
    body,
    func,
    mode
  } = callAPI
  const {
    types
  } = callAPI
  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [requestType, successType, failureType] = types
  next(actionWith({
    body,
    type: requestType
  }))


  return callApiwithPost(endpoint, body, func, mode).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
