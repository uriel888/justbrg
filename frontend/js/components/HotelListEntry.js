import React, {
  Component,
  PropTypes
} from 'react'
import moment from "moment"
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {blue500, red500, green500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import SvgIcon from 'material-ui/SvgIcon';
import Paper from 'material-ui/Paper';

export default class HotelListEntry extends Component {
  render() {
    const iconStyles = {
      marginRight: 24,
    };
    const paperStyles = {
      margin: 20,
    };

    const CheckIcon = (props) => (
      <SvgIcon {...props}>
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
      </SvgIcon>
    );

    const CrossIcon = (props) => (
      <SvgIcon {...props}>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </SvgIcon>
    );

    const ErrorIcon = (props) => (
      <SvgIcon {...props}>
        <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      </SvgIcon>
    );

    const ThumbIcon = (props) => (
      <SvgIcon {...props}>
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
      </SvgIcon>
    );
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
      <Paper style={paperStyles} zDepth={2}>
        <Card>
        <CardHeader
          title={hotel.hotel_name}
          subtitle={bestPlan?<div>Best Point Usage : {bestPlan.plan} With value($/Point) : {bestPlan.potential_value.toFixed(4)} {(bestPlan.potential_value>0.025)?<ThumbIcon style={iconStyles} color={green500}/>:false}<br /></div>:false}
          avatar={message?(message.indexOf('error')>0?(<div><ErrorIcon style={iconStyles} color={red500}/><p>If you are not using Chrome, access  <a href="http://hotels.justbrg.com/" target='_blank'> this page </a> before your search might fixed the issue. </p></div>):<CrossIcon style={iconStyles} color={red500}/>):<CheckIcon style={iconStyles} color={green500}/>}
        />

        <CardText>
          Hotel official Price($/day):  {hotel.BAR} <br />
          BRG Rate($/day):  {message?message:competeRate}<br />
          {message?false:(<p>You can save around ${ ((hotel.BAR-competeRate*0.8)>(hotel.BAR-competeRate+40))? (hotel.BAR-competeRate*0.8).toFixed(1) : (hotel.BAR-competeRate+40).toFixed(1)}/day by choosing {((hotel.BAR-competeRate*0.8)>(hotel.BAR-competeRate+40))? '80% of BRG price' : '2000 points (2000 points round to $40)'}.</p>)}
        </CardText>
        <CardActions>
          <FlatButton label="BRG" href={"http://hotelscombined.com"+compete.competeURL} target="_blank" disabled={message?true:false}/>
          {
            hotel.officialURL?<FlatButton label="Official" href={hotel.officialURL} target="_blank" />:false
          }
          {message?false:
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" style={{display:'inline-block',}}>
              <input type="hidden" name="cmd" value="_s-xclick" />
              <input type="hidden" name="hosted_button_id" value="FV9N6YUBXCSY8" />
              <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
              <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
            </form>
          }
        </CardActions>
        </Card>
      </Paper>
    )
  }
}
