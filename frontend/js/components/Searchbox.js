import React, {
  Component
} from 'react'

import {
  bindActionCreators
} from 'redux'

import moment from "moment"

import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import SvgIcon from 'material-ui/SvgIcon';
import FlatButton from 'material-ui/FlatButton';
import {
  fetchCandidate
} from '../actions/autocomplete'


export default class Searchbox extends Component {
  constructor(props) {
    super(props);
    const {query, candidate} = this.props

    this.state = {
      minArrivalDate: moment().add(1, 'days').toDate(),
      checkin: query.checkin?moment(query.checkin, "MM/DD/YYYY").toDate():undefined,
      minDepartureDate: query.checkin?moment(query.checkin, "MM/DD/YYYY").toDate() : moment().add(1, 'days').toDate(),
      checkout: query.checkout?moment(query.checkout, "MM/DD/YYYY").toDate():undefined,
      toggle_option: query.source?query.source.toLowerCase():"spg",
      location_option: candidate,
      location: query.city?(query.country.toLowerCase()=='united states'?(query.city+", "+query.state+", "+query.country):(query.city+", "+query.country)):undefined,
      city_code: query.city,
      state_code: query.state,
      country_code: query.country
    }

    this.selectLocation = this.selectLocation.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.updateCheckin = this.updateCheckin.bind(this);
    this.updateCheckout = this.updateCheckout.bind(this);
    this.updateSPGToggle = this.updateSPGToggle.bind(this);
    this.updateMToggle = this.updateMToggle.bind(this);
    this.updateHToggle = this.updateHToggle.bind(this);
  }

  updateCheckin(event, checkin){
    this.setState({
      checkin: moment(checkin).toDate(),
      minDepartureDate: moment(checkin).add(1, 'days').toDate(),
      checkout: moment(checkin).add(1, 'days').toDate()
    });
  }

  updateCheckout(event, checkout){
    this.setState({
      checkout: moment(checkout).toDate()
    });
  }

  selectLocation(location){
    let temp = location.split(',');
    if(temp.length == 3){
      this.setState({
        city_code: temp[0].trim(),
        state_code: temp[1].trim(),
        country_code: temp[2].trim()
      });
    }else{
      this.setState({
        city_code: temp[0].trim(),
        country_code: temp[1].trim()
      });
    }

  }

  updateLocation(location){
    const { dispatch, candidate } = this.props
    if(location.length < 3){
      dispatch({type:'AUTOCOMPLETE_FAIL'})
    }else{
      let autocompleteCreater = bindActionCreators(fetchCandidate, dispatch)
      autocompleteCreater(location);
    }
  }

  updateSPGToggle(){
    this.setState({
      toggle_option: 'spg'
    });
  }

  updateMToggle(){
    this.setState({
      toggle_option: 'marriott'
    });
  }

  updateHToggle(){
    this.setState({
      toggle_option: 'hilton'
    });
  }
  render() {
    const { searchButtonClick, query, generalFetching, dispatch} = this.props
    let checkout_date = moment().add(3, 'days')
    if(query.checkout){
      checkout_date = moment(query.checkout, "MM/DD/YYYY")
    }

    let input_checkout_date = checkout_date.format("YYYY-MM-DD")

    const textFieldStyle = {
      autocomplete: {
        width: 400,
      },
      display:'inline-block',
      margin:'15px',
    }
    const formStyle = {
      textAlign:'center',
    }
    const toggledStyles = {
      block: {
        margin:'5px',
      },
      toggle: {
        width: 150,
        display:'inline-block',
        marginBottom: 16,
      },
    };

    const buttonStyle = {
      marginLeft: 50,
      display: 'inline-block',
      backgroundColor: 'transparent',
    };
    const iconStyles = {
      height: '48px',
      width: '48px',
    };

    const row = {
      textAlign:'left',
    }
    const CancelIcon = (props) => (
      <SvgIcon {...props}>
        <path d="M9 1C4.58 1 1 4.58 1 9s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4 10.87L11.87 13 9 10.13 6.13 13 5 11.87 7.87 9 5 6.13 6.13 5 9 7.87 11.87 5 13 6.13 10.13 9 13 11.87z" />
      </SvgIcon>
    );
    return (
        <div>
          <form onSubmit={(e)=>{
            e.preventDefault()
            const {query} = this.props
            let checkin = moment(this.state.checkin).format("MM/DD/YYYY")
            let checkout = moment(this.state.checkout,"YYYY-MM-DD").format("MM/DD/YYYY")

            if(generalFetching){
              dispatch({type:"SEARCH_COMPLETE"})
            }
            else{
              searchButtonClick(query, this.state.city_code, this.state.state_code, this.state.country_code, checkin, checkout, this.state.toggle_option)
            }
          }}>
            <div style={formStyle}>
              <AutoComplete
                style={textFieldStyle.autocomplete}
                fullWidth={true}
                floatingLabelText="Type Location Here"
                dataSource={this.props.candidate}
                filter={AutoComplete.caseInsensitiveFilter}
                onUpdateInput={this.updateLocation}
                onNewRequest={this.selectLocation}
                searchText={this.state.location}
              />

              <DatePicker
                style={textFieldStyle}
                floatingLabelText="Date of Arrival"
                autoOk={true}
                minDate={this.state.minArrivalDate}
                onChange={this.updateCheckin}
                value={this.state.checkin}
              />

              <DatePicker
                style={textFieldStyle}
                floatingLabelText="Date of Departure"
                autoOk={true}
                minDate={this.state.minDepartureDate}
                onChange={this.updateCheckout}
                value={this.state.checkout}
              />
            <div style={toggledStyles.block}>
              <Toggle
                label="SPG"
                toggled = {('spg'==this.state.toggle_option)}
                style={toggledStyles.toggle}
                onToggle={this.updateSPGToggle}
              />
              <Toggle
                label="marriott (BETA)"
                toggled = {('marriott'==this.state.toggle_option)}
                style={toggledStyles.toggle}
                onToggle={this.updateMToggle}
              />
              <Toggle
                label="Hilton"
                toggled = {('hilton'==this.state.toggle_option)}
                style={toggledStyles.toggle}
                onToggle={this.updateHToggle}
                disabled={true}
              />
            {!generalFetching?
              (<FlatButton label="Search" disabled={generalFetching} style={buttonStyle} type="submit" />):
              (<FlatButton
                // onClick={() =>dispatch({type:"SEARCH_COMPLETE"})}
                label="Cancel"
                style={buttonStyle}
                type="submit"
              />)
            }
          </div>
          </div>
          </form>
        </div>

    )
  }
}
