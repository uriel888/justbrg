import {
  ENCRPTY_SEARCH_FAIL,
  ENCRPTY_SEARCH_SUCCESS,
  ENCRPTY_SEARCH_REQUEST,
  CRAWLER_SEARCH_FAIL,
  CRAWLER_SEARCH_SUCCESS,
  CRAWLER_SEARCH_REQUEST,
  COMPETE_SEARCH_FAIL,
  COMPETE_SEARCH_SUCCESS,
  COMPETE_SEARCH_REQUEST,
  REDIRECT_SEARCH_SUCCESS,
  SEARCH_COMPLETE
} from '../actions/search'
const initialState = {
  generalFetching: false,
  crawlerFetching: false,
  competeFetching: false,
  redirectFetching: false,
  hotelscombinedCookieFetched: false,
  encryptedMessage: "",
  hotelList: [],
  competeList: [],
  redirectList: {},
  componentList: {},
  remain: 0,
  error: ""
}

const search = (state = initialState, action) => {
  let new_componentList = state.componentList
  switch (action.type) {
    case 'HOTELSCOMBINED_COOKIE_FETCHED':
      return Object.assign({}, state, {
        hotelscombinedCookieFetched: true
      })
    case 'COMPONENT_INIT':
      if(new_componentList[action.componentKey]){
        return state;
      }
      new_componentList[action.componentKey] = {toggled:false}
      return Object.assign({}, state, {
        componentList: new_componentList
      })
    case 'COMPONENT_TOGGLE':
      new_componentList[action.componentKey].toggled = action.state
      return Object.assign({}, state, {
        componentList: new_componentList
      })
    case 'REMAIN_REQUEST':
      return Object.assign({}, state, {
        remain: 1
      })
    case 'REMAIN_DONE':
      return Object.assign({}, state, {
        remain: 0
      })
    case ENCRPTY_SEARCH_REQUEST:
      return Object.assign({}, state, {
        generalFetching: true,
        hotelList: [],
        competeList: [],
        componentList: {},
        encryptedMessage: "",
        error: ""
      })
    case ENCRPTY_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        generalFetching: true,
        encryptedMessage: action.response.message,
        error: ""
      })
    case ENCRPTY_SEARCH_FAIL:
      alert(action.error);
      if (action.error == "Unauthorized") {
        localStorage.removeItem('email')
        location.reload();
      }
      return Object.assign({}, state, {
        generalFetching: false,
        error: action.error
      })
    case CRAWLER_SEARCH_REQUEST:
      return Object.assign({}, state, {
        crawlerFetching: true,
        error: ""
      })
    case CRAWLER_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        crawlerFetching: false,
        hotelList: action.response,
        error: ""
      })
    case CRAWLER_SEARCH_FAIL:
      alert(action.error);
      if (action.error == "Unauthorized") {
        localStorage.removeItem('email')
        location.reload();
      }
      return Object.assign({}, state, {
        crawlerFetching: false,
        generalFetching: false,
        error: action.error
      })
    case COMPETE_SEARCH_REQUEST:
      return Object.assign({}, state, {
        competeFetching: true,
        error: ""
      })
    case COMPETE_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        competeFetching: false,
        competeList: [...state.competeList, action.response],
        error: ""
      })
    case COMPETE_SEARCH_FAIL:
      if (action.error == "Unauthorized") {
        alert(action.error);
        localStorage.removeItem('email')
        location.reload();
        return Object.assign({}, state, {
          competeFetching: false,
          generalFetching: false,
          error: action.error
        })
      } else if (action.error == "LOADING") {
        return Object.assign({}, state, {
          competeFetching: false,
          error: ""
        })
      }
      return Object.assign({}, state, {
        competeFetching: false,
        competeList: [...state.competeList, "error"],
        error: ""
      })
    case REDIRECT_SEARCH_SUCCESS:
      let new_redirect_list = state.redirectList
      new_redirect_list[action.hotel_name] = action.completeCompeteURL
      return Object.assign({}, state, {
        redirectFetching: false,
        redirectList: new_redirect_list,
        error: ""
      })
    case SEARCH_COMPLETE:
      return Object.assign({}, state, {
        generalFetching: false
      })
    default:
      return state
  }
}

export default search
