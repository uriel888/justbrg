import {
  combineReducers
} from 'redux'
import account from './account'
import search from './search'
import autocomplete from './autocomplete'
import { routerReducer as routing } from 'react-router-redux'

const rootReducer = combineReducers({
  account,
  search,
  autocomplete,
  routing
})

export default rootReducer
