import React, {
  Component,
  PropTypes
} from 'react'
import moment from "moment"
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import * as master_options from '../static/json/selector_options.json'

export default class Searchbox extends Component {
  constructor(props) {
    super(props);
    const {query} = this.props

    this.state = {
      state_code: query.state?query.state.toLowerCase():"illinois",
      country_code: query.country?query.country.toLowerCase():"united states"
    }

    this.updateState = this.updateState.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
  }

  updateState(state_code) {
    this.setState({
      state_code: state_code.value
    });
  }

  updateCountry(country_code) {
    this.setState({
      country_code: country_code.value
    });
  }

  render() {
    const { searchButtonClick, query, generalFetching, dispatch} = this.props
    let checkin_date = moment().add(2, 'days')
    if(query.checkin){
      checkin_date = moment(query.checkin, "MM/DD/YYYY")
    }

    let checkout_date = moment().add(3, 'days')
    if(query.checkout){
      checkout_date = moment(query.checkout, "MM/DD/YYYY")
    }

    let input_checkin_date = checkin_date.format("YYYY-MM-DD")
    let input_checkout_date = checkout_date.format("YYYY-MM-DD")

    let states_options = master_options.states
    let countries_options = master_options.countries

    function logChange(val) {
      console.log("Selected: " + val.value);
      state_code = val.value
    }

    return (
      <form onSubmit={(e)=>{
        e.preventDefault()
        let checkin = moment(this.refs.checkin.value,"YYYY-MM-DD").format("MM/DD/YYYY")
        let checkout = moment(this.refs.checkout.value,"YYYY-MM-DD").format("MM/DD/YYYY")

        searchButtonClick(this.refs.city.value, this.state.state_code, this.state.country_code, checkin, checkout, this.refs.source.value)
      }}>
        <label>City:  <input ref="city" placeholder="city" defaultValue={query.city?query.city:"Chicago"} /></label><br />
        <label>State(Only need for united states):
        < Select
        name = "form-field-name"
        value = {this.state.state_code}
        options = {
          states_options
        }
        onChange = {
          this.updateState
        }
        />
        </label><br />
        <label>Country:
        < Select
        name = "form-field-name"
        value = {this.state.country_code}
        options = {
          countries_options
        }
        onChange = {
          this.updateCountry
        }
        />
        </label><br />
        <label>Date of Arraving:  <input type="date" ref="checkin" placeholder="checkin" defaultValue={input_checkin_date}/></label><br />
        <label>Date of Departing: <input type="date" ref="checkout" placeholder="checkout" defaultValue={input_checkout_date}/></label><br />
        <label>Source: <input ref="source" placeholder="source" defaultValue={query.source?query.source:"SPG"}/></label><br />
        {generalFetching?<button type="button" onClick={() =>dispatch({type:"SEARCH_COMPLETE"})}>Cancel</button>:<button type="submit">Search</button>}
      </form>
    )
  }
}
