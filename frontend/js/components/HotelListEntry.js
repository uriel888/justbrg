import React, {
  Component,
  PropTypes
} from 'react'
import moment from "moment"

export default class HotelListEntry extends Component {
  render() {
    const {hotel, compete, redirectSearch, query, redirectList} = this.props
    let competeRate = compete.competeRate
    let message = undefined
    let bestPlan = undefined
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
    else if(competeRate+1 > hotel.BAR || compete.competeRate=="9999"){
      message = "No BRG"
    }

    if (hotel.BAR && (hotel.FN || hotel.CP)) {
      let fn = 0;
      let cp = 0;
      bestPlan = {}
      if (hotel.FN) {
        fn = hotel.BAR / hotel.FN
      }

      if (hotel.CP) {
        cp = (hotel.BAR - hotel.CP.c) / hotel.CP.p
      }
      if (cp >= fn) {
        bestPlan.plan = "Cash & Points"
        bestPlan.potential_value = cp
      }else{
        bestPlan.plan = "Only Points"
        bestPlan.potential_value = fn
      }
    }

    return (
      <div>
        < li > Hotel Name:  {hotel.hotel_name} <br />
               {bestPlan?<div>Best Point Usage : {bestPlan.plan} With value($/Point) : {bestPlan.potential_value.toFixed(4)}<br /></div>:false}
               Hotel official Price($/day):  {hotel.BAR} <br />
               BRG Rate($/day):  {message?message:competeRate}<br />
               {
                 (()=>{
                   if(!message){
                     if(redirectList[hotel.hotel_name]){
                       return <a href={redirectList[hotel.hotel_name]} target="_blank">Link to the BRG site</a>
                     }
                     else{
                       return <button onClick={() =>redirectSearch(compete.competeURL, hotel.hotel_name)}>Click me For BRG LINK</button>
                     }
                   }
                 })()
               }
        < /li>-------------------------<br />
      </div>
    )
  }
}
