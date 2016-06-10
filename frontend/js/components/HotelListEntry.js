import React, {
  Component,
  PropTypes
} from 'react'
import moment from "moment"

export default class HotelListEntry extends Component {
  render() {
    const {hotel, compete, redirectSearch, query} = this.props
    let competeRate = 0
    let message = undefined
    if(compete.competeRate != undefined){
      let arrivalMoment = moment(query.checkin, "MM/DD/YYYY")
      let departureMoment = moment(query.checkout, "MM/DD/YYYY")
      let daysDiff = departureMoment.diff(arrivalMoment, 'days')
      if(daysDiff > 0){
        competeRate = compete.competeRate/daysDiff
      }
    }
    if(compete.competeRate == undefined){
      message = "Some error when mapping official hotel name to compete site"
    }
    else if(compete.competeRate+1 > hotel.BAR || compete.competeRate=="9999"){
      message = "No BRG"
    }


    return (
      <div>
        < li > Hotel Name:  {hotel.hotel_name} <br />  Hotel Officail Price:  {hotel.BAR} <br />  BRG Rate:  {message?message:competeRate}<br /> {message?false:<button onClick={() =>redirectSearch(compete.competeURL)}>Click me For BRG LINK</button>}<br />< /li>-------------------------<br />
      </div>
    )
  }
}
