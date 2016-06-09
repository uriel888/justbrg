import React, {
  Component,
  PropTypes
} from 'react'

export default class HotelListEntry extends Component {
  render() {
    const {hotel, compete, redirectSearch} = this.props
    let message = undefined
    if(compete.competeRate == undefined){
      message = "Some error when mapping official hotel name to compete site"
    }
    else if(compete.competeRate+1 > hotel.BAR || compete.competeRate=="9999"){
      message = "No BRG"
    }

    return (
      <div>
        < li > Hotel Name:  {hotel.hotel_name} <br />  Hotel Officail Price:  {hotel.BAR} <br />  BRG Rate:  {message?message:compete.competeRate}<br /> {message?false:<button onClick={() =>redirectSearch(compete.competeURL)}>Click me For BRG LINK</button>}<br />< /li>-------------------------<br />
      </div>
    )
  }
}
