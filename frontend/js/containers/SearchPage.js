import React, {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  push
} from 'react-router-redux'

import uuid from 'node-uuid'

import {
  bindActionCreators
} from 'redux'

import {
  generalSearch,
  crawlerSearch,
  competeSearch,
  redirectSearch
} from '../actions/search'

import HotelListEntry from '../components/HotelListEntry'
const mapStateToProps = (
  state
) => {
  return {
    generalFetching: state.search.generalFetching,
    competeFetching: state.search.competeFetching,
    competeList: state.search.competeList,
    hotelList: state.search.hotelList,
    redirectList: state.search.redirectList
  }
}

export default class SearchPage extends Component {
  componentDidMount() {
    const {
      query
    } = this.props.location
    const {dispatch , generalFetching} = this.props
    let generalSearchCreater = bindActionCreators(generalSearch, dispatch)
    let crawlerSearchCreater = bindActionCreators(crawlerSearch, dispatch)

    if(query!={}){
      return generalSearchCreater(query).then(crawlerSearchCreater)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      query
    } = nextProps.location
    const {
      dispatch,
      generalFetching,
      hotelList
    } = this.props
    let generalSearchCreater = bindActionCreators(generalSearch, dispatch)
    let crawlerSearchCreater = bindActionCreators(crawlerSearch, dispatch)
    let temp1 = this.props.location.search.replace(/ /g,'%20')
    let temp2 = nextProps.location.search.replace(/ /g,'%20')
    if(temp1.localeCompare(temp2)==0){
      return
    }

    if (query != {}) {
      return generalSearchCreater(query).then(crawlerSearchCreater)
    }
  }

  render() {
    const {
      query
    } = this.props.location

    const {
      dispatch,
      generalFetching,
      competeFetching,
      hotelList,
      redirectList,
      competeList
    } = this.props
    let competeSearchCreater = bindActionCreators(competeSearch, dispatch)
    let redirectSearchCreater = bindActionCreators(redirectSearch, dispatch)
    if(generalFetching && competeList.length < hotelList.length && !competeFetching){
      setTimeout(competeSearchCreater, 5000);
    }
    if(competeList.length == hotelList.length && generalFetching && hotelList.length > 0){
      dispatch({
        type:"SEARCH_COMPLETE"
      })
    }
    return (
      <div>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="FV9N6YUBXCSY8" />
          <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
          <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
        </form>


        <label>{generalFetching?<i className="fa fa-spinner fa-spin" style={{"fontSize":"24px"}}></i>:false}</label><br />
        <label>{hotelList.length!=0&&generalFetching?<div>Found {hotelList.length} hotels in request area, current search BRG for {competeList.length}/{hotelList.length}</div>:false}</label><br />
        <ul>
          {competeList.map(
            function(result, index){
              return <HotelListEntry key={uuid.v1()} hotel={hotelList[index]} compete={result} redirectSearch={redirectSearchCreater} query={query} redirectList={redirectList}/>
            }
          )}
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps)(SearchPage)
