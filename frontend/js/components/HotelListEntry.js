import React, {
  Component
} from 'react'
import moment from "moment"
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {blue500, grey500, red500, green500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import SvgIcon from 'material-ui/SvgIcon';
import Paper from 'material-ui/Paper';
import Maps from './googleMaps';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';

import { vatSPGInclusiveList } from '../static/json/lists'
export default class HotelListEntry extends Component {
  constructor(props) {
    super(props);
    const {componentList, hotel, compete, dispatch} = this.props

    this.state = {
      officialURL: hotel.officialURL,
      competeURL: "http://hotelscombined.com"+compete.competeURL,
      showMap: componentList[hotel.hotel_name].toggled
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.buttonOnClick = this.buttonOnClick.bind(this);
  }

  buttonOnClick(type){
    if(type == 'BRG'){
        let win = window.open(this.state.competeURL, '_blank');
        if(ga){
          const {query} = this.props
          ga('send', 'event', 'button', 'click', `${query.source.toUpperCase()}BRG`);
        }
        win.focus();
    }else if(type == 'OFFICIAL'){
        let win = window.open(this.state.officialURL, '_blank');
        if(ga){
          const {query} = this.props
          ga('send', 'event', 'button', 'click', `${query.source.toUpperCase()}OFFICIAL`);
        }
        win.focus();
    }
  }
  handleToggle(event, toggle){
    this.setState({showMap: toggle});
    const {dispatch, hotel} = this.props
    dispatch({
      type:"COMPONENT_TOGGLE",
      componentKey: hotel.hotel_name,
      state: toggle
    })

  };

  render() {
    const iconStyles = {
      marginRight: '24px',
    };

    const cardStyles = {
      backgroundColor: 'rgba(188,187,169,0.67)',
    }
    const subCardStyles = {
      left: {
        width:"70%",
        height:'auto',
        display:'inline-block',
      },
      right: {
        width:"30%",
        display:'inline-block',
        verticalAlign: 'top',
        textAlign: 'right',
      }
    }
    const paperStyles = {
      main: {
        margin: 20,
        backgroundColor:' transparent'
      },
      sub: {
        margin: '0 auto',
      }
    };


    const fontStyles = {
      head: {
        fontSize: 25,
        fontWeight: 900,
      },
      normal: {
        fontSize: 20,
        fontWeight: 600,
      },
      cancelOut: {
        fontSize: 15,
        fontWeight: 'normal',
      },
      message: {
        fontSize: 18,
        fontWeight: 'normal',
      },
      submessage: {
        fontSize: 12,
        fontWeight: 'normal',
        display: 'inline-block',
        margin: 10
      }
    }

    const MapIcon = (props) =>(
      <SvgIcon {...props}>
        <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
      </SvgIcon>
    )
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
    const {hotel, compete, redirectSearch, query, componentList, geometry} = this.props
    let competeRate = compete.competeRate
    let message = undefined
    let bestPlan = undefined
    let BAR = hotel.BAR

    if(BAR && vatSPGInclusiveList[query.country.toLowerCase()]){
      BAR/= (1+vatSPGInclusiveList[query.country.toLowerCase()]);
      BAR = BAR.toFixed(0)
    }

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
    else if(competeRate+1.5 >BAR || compete.competeRate=="9999"){
      message = "No BRG"
    }

    if (BAR && (hotel.FN || hotel.CP)) {
      let fn = 0;
      let cp = 0;
      bestPlan = {}
      if (hotel.FN) {
        fn = BAR / hotel.FN
      }

      if (hotel.CP) {
        cp = (BAR - hotel.CP.c) / hotel.CP.p
      }
      if (cp >= fn) {
        bestPlan.plan = `Cash & Points: $${ hotel.CP.c} + ${hotel.CP.p} points`
        bestPlan.potential_value = cp
      }else{
        bestPlan.plan = `Points Only: ${hotel.FN} points`
        bestPlan.potential_value = fn
      }
    }
    let hotel_title = undefined;
    let hotel_subtitle = undefined;
    if(hotel.address){
      hotel_title = "";
      hotel_subtitle = "";
      let hotel_title_array = hotel.address.split(',');
      if((hotel_title_array.length - 1) == 1){
        hotel_title += hotel_title_array[0];
      }
      else{
        for(let i = 0 ; i < hotel_title_array.length - 1 ; i++){
          if(i < (hotel_title_array.length - 1)/2){
            hotel_title += hotel_title_array[i];
          }else{
            hotel_subtitle += hotel_title_array[i]
          }
        }
      }
    }
    if(!hotel.img){
      hotel.img = "https://www.starwoodhotels.com/pub/media/4313/lux4313ex.173791_ss.jpg"
    }else if(hotel.img.indexOf("http") >= 0){
      hotel.img = hotel.img
    }else if(hotel.img.indexOf("https://www.starwoodhotels.com/") < 0){
      hotel.img = ("https://www.starwoodhotels.com/"+hotel.img).replace(/tt.jpg/,"ss.jpg")
    }

    let button_label = message?(message.indexOf('error')>0?"MAPPING ERROR":"NO BRG"):"BRG"
    return (
      <Paper style={paperStyles.main} zDepth={2}>
        <Card style = {cardStyles}>
          <div style={subCardStyles.left}>
            <CardHeader
              titleStyle = {fontStyles.head}
              subtitleStyle = {fontStyles.normal}
              title={hotel.hotel_name}
              subtitle={bestPlan?<div>{bestPlan.plan} with value($/Point) : {bestPlan.potential_value.toFixed(4)} {(bestPlan.potential_value>0.025)?<ThumbIcon style={iconStyles} color={green500}/>:false}<br /></div>:false}
              avatar = {<Avatar src={hotel.img} size={55} />}
            />

            <CardText style={fontStyles.normal}>
              {
                message?(<div>${BAR}/night{vatSPGInclusiveList[query.country.toLowerCase()]?(<div style={fontStyles.submessage}>(VAT excluded)</div>):false}</div>):(<div><p>${competeRate}/night{vatSPGInclusiveList[query.country.toLowerCase()]?(<div style={fontStyles.submessage}>(VAT excluded)</div>):false}</p><p style={fontStyles.cancelOut}><s>${BAR}/night</s></p></div>)
              }

              {message?false:(<p style={fontStyles.message}>You can save around ${ ((BAR-competeRate*0.8)>(BAR-competeRate+40))? (BAR-competeRate*0.8).toFixed(1) : (BAR-competeRate+40).toFixed(1)}/night by choosing {((BAR-competeRate*0.8)>(BAR-competeRate+40))? '80% of BRG price' : '2000 points (2000 points round to $40)'}.</p>)}
            </CardText>
            <CardActions>
              <FlatButton onClick={() => this.buttonOnClick('BRG')} label={button_label} icon={message?(message.indexOf('error')>0?(<ErrorIcon style={iconStyles} color={red500}/>):<CrossIcon style={iconStyles} color={red500}/>):<CheckIcon style={iconStyles} color={green500}/>} disabled={message?true:false}/>
              {
                this.state.officialURL?<FlatButton onClick={() => this.buttonOnClick('OFFICIAL')} label="Official" target="_blank" />:false
              }
              {message?false:
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" style={{display:'inline-block',}}>
                  <input type="hidden" name="cmd" value="_s-xclick" />
                  <input type="hidden" name="hosted_button_id" value="FV9N6YUBXCSY8" />
                  <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                  <img alt="" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                </form>
              }
            </CardActions>
          </div>
          <div style={subCardStyles.right}>
            <CardTitle
              titleStyle = {fontStyles.normal}
              subtitleStyle = {fontStyles.normal}
              title={hotel_title}
              subtitle={hotel_subtitle}
              />
            {
              hotel.geo?(
                <div>
                  <CardText>
                  <Toggle
                      toggled={this.state.showMap}
                      onToggle={this.handleToggle}
                      label={this.state.showMap?<MapIcon style={iconStyles} color={blue500}/>:<MapIcon style={iconStyles} color={grey500}/>}
                    />
                  </CardText>
                  {
                    this.state.showMap?<CardMedia style={{float:'right'}}><Maps componentKey={hotel.hotel_name} geo={hotel.geo}/></CardMedia>:false
                  }
                </div>
              ):false
            }
          </div>
        </Card>
      </Paper>
    )
  }
}
