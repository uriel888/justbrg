import {
  CALL_API
} from '../middleware/api'
import {
  push
} from 'react-router-redux'
import ReactGA from 'react-ga'

export function search(city, state, country, checkin, checkout, source) {
  return (dispatch) => {
    ReactGA.ga('send', 'pageview', '/search?city=' + city + '&state=' + state + '&country=' + country + '&checkin=' + checkin + '&checkout=' + checkout + "&source=" + source);
    return dispatch(push('/search?city=' + city + '&state=' + state + '&country=' + country + '&checkin=' + checkin + '&checkout=' + checkout + "&source=" + source))
  }
}

export const ENCRPTY_SEARCH_FAIL = 'ENCRPTY_SEARCH_FAIL'
export const ENCRPTY_SEARCH_SUCCESS = 'ENCRPTY_SEARCH_SUCCESS'
export const ENCRPTY_SEARCH_REQUEST = 'ENCRPTY_SEARCH_REQUEST'

function postEncryptSearch(detail) {
  return {
    [CALL_API]: {
      types: [ENCRPTY_SEARCH_REQUEST, ENCRPTY_SEARCH_SUCCESS, ENCRPTY_SEARCH_FAIL],
      endpoint: `search`,
      body: detail,
      mode: 'api'
    }
  }
}


export function generalSearch(detail) {
  console.log(detail);
  return (dispatch) => {
    return dispatch(postEncryptSearch(detail))
  }
}

export const CRAWLER_SEARCH_FAIL = 'CRAWLER_SEARCH_FAIL'
export const CRAWLER_SEARCH_SUCCESS = 'CRAWLER_SEARCH_SUCCESS'
export const CRAWLER_SEARCH_REQUEST = 'CRAWLER_SEARCH_REQUEST'

function postCrawlerSearch(detail) {
  return {
    [CALL_API]: {
      types: [CRAWLER_SEARCH_REQUEST, CRAWLER_SEARCH_SUCCESS, CRAWLER_SEARCH_FAIL],
      endpoint: ``,
      body: detail,
      mode: 'crawler'
    }
  }
}


export function crawlerSearch(getState) {
  return (dispatch, getState) => {
    const state = getState();
    return dispatch(postCrawlerSearch(state.search.encryptedMessage))
  }
}

export const COMPETE_SEARCH_FAIL = 'COMPETE_SEARCH_FAIL'
export const COMPETE_SEARCH_SUCCESS = 'COMPETE_SEARCH_SUCCESS'
export const COMPETE_SEARCH_REQUEST = 'COMPETE_SEARCH_REQUEST'

function postCompeteSearch(url) {
  return {
    [CALL_API]: {
      types: [COMPETE_SEARCH_REQUEST, COMPETE_SEARCH_SUCCESS, COMPETE_SEARCH_FAIL],
      endpoint: url,
      mode: 'compete'
    }
  }
}

export function competeSearch(getState) {
  return (dispatch, getState) => {
    const state = getState();
    let current_index = state.search.competeList.length
    let target_hotel = state.search.hotelList[current_index]
    let url = target_hotel.targetURL
    if(url == undefined || url.indexOf('TOADD') > 0){
      return dispatch({type:"COMPETE_SEARCH_FAIL"});
    }
    if (current_index == 0) {
      return fetch("http://hotels.justbrg.com/", {
        method: 'GET',
        credentials: 'include'
      }).then((response) => {
        response.text().then((text) => {
          dispatch(postCompeteSearch(url))
        })
      })
    } else {
      return dispatch(postCompeteSearch(url))
    }
  }
}


export const SEARCH_COMPLETE = 'SEARCH_COMPLETE'

export const REDIRECT_SEARCH_FAIL = 'REDIRECT_SEARCH_FAIL'
export const REDIRECT_SEARCH_SUCCESS = 'REDIRECT_SEARCH_SUCCESS'
export const REDIRECT_SEARCH_REQUEST = 'REDIRECT_SEARCH_REQUEST'

export function redirectSearch(url, hotel_name) {
  return (dispatch, getState) => {
    return fetch("http://hotels.justbrg.com" + url, {
      method: 'GET',
      credentials: 'include'
    }).then((response) => {
      response.text().then((text) => {
        text = text.substr(text.indexOf('var url = \'') + ('var url = \'').length)
        text = text.substr(0, text.indexOf('\''))
        dispatch({type:"REDIRECT_SEARCH_SUCCESS", completeCompeteURL:text, hotel_name:hotel_name})
      })
    }).catch(
      console.log("BAD!")
    )
  }
}
