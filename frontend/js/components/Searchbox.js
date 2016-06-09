import React, {
  Component,
  PropTypes
} from 'react'

export default class Searchbox extends Component {
  render() {
    const { searchButtonClick, query, generalFetching, dispatch} = this.props
    return (
      <form onSubmit={(e)=>{
        e.preventDefault()
        searchButtonClick(this.refs.city.value, this.refs.state.value, this.refs.country.value, this.refs.checkin.value, this.refs.checkout.value, this.refs.source.value)
      }}>
        <label>City:  <input ref="city" placeholder="city" defaultValue={query.city?query.city:"Chicago"} /></label><br />
        <label>State(Only need for united states):  <input ref="state" placeholder="state" defaultValue={query.state?query.state:"Illinois"} /></label><br />
        <label>Country: <input ref="country" placeholder="country" defaultValue={query.country?query.country:"United States"} /></label><br />
        <label>Date of Arraving:  <input ref="checkin" placeholder="checkin" defaultValue={query.checkin?query.checkin:"06/28/2016"}/></label><br />
        <label>Date of Departing: <input ref="checkout" placeholder="checkout" defaultValue={query.checkout?query.checkout:"06/29/2016"}/></label><br />
        <label>Source: <input ref="source" placeholder="source" defaultValue={query.source?query.source:"SPG"}/></label><br />
        {generalFetching?<button type="button" onClick={() =>dispatch({type:"SEARCH_COMPLETE"})}>Cancel</button>:<button type="submit">Search</button>}
      </form>
    )
  }
}
