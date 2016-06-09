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


import {
  bindActionCreators
} from 'redux'

import { generalSearch, crawlerSearch, competeSearch, redirectSearch} from '../actions/search'
import HotelListEntry from '../components/HotelListEntry'

const mapStateToProps = (
  state
) => {
  return {
    generalFetching: state.search.generalFetching,
    competeFetching: state.search.competeFetching,
    competeList: state.search.competeList,
    hotelList: state.search.hotelList
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
      competeList
    } = this.props
    let competeSearchCreater = bindActionCreators(competeSearch, dispatch)
    let redirectSearchCreater = bindActionCreators(redirectSearch, dispatch)
    if(generalFetching && competeList.length < hotelList.length && !competeFetching){
      setTimeout(competeSearchCreater, 3000);
    }
    if(competeList.length == hotelList.length && generalFetching && hotelList.length > 0){
      dispatch({
        type:"SEARCH_COMPLETE"
      })
    }
    return (
      <div>
        <label>{generalFetching?<i className="fa fa-spinner fa-spin" style={{"fontSize":"24px"}}></i>:false}</label><br />
        <label>{hotelList.length!=0&&generalFetching?<div>Found {hotelList.length} hotels in request area, current search BRG for {competeList.length}/{hotelList.length}</div>:false}</label><br />
        <ul>
          {competeList.map(
            function(result, index){
              return <HotelListEntry hotel={hotelList[index]} compete={result} redirectSearch={redirectSearchCreater}/>
            }
          )}
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps)(SearchPage)
