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

import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';

import HotelListEntry from '../components/HotelListEntry'
const mapStateToProps = (
  state
) => {
  return {
    generalFetching: state.search.generalFetching,
    competeFetching: state.search.competeFetching,
    competeList: state.search.competeList,
    hotelList: state.search.hotelList,
    redirectList: state.search.redirectList,
    remain: state.search.remain
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

    if (query != {}) {
      return generalSearchCreater(query).then((getState) => {
        if (this.props.generalFetching) {
          crawlerSearchCreater(getState)
        }
      })
    }
  }

  componentDidUpdate(nextProps) {
    let {
      query
    } = nextProps.location
    const {
      dispatch,
      generalFetching,
      remain,
      hotelList
    } = this.props
    let generalSearchCreater = bindActionCreators(generalSearch, dispatch)
    let crawlerSearchCreater = bindActionCreators(crawlerSearch, dispatch)
    let temp1 = this.props.location.search.replace(/ /g,'%20')
    let temp2 = nextProps.location.search.replace(/ /g,'%20')
    if(temp1.localeCompare(temp2)==0 && remain <= 0 ){
      return
    }
    dispatch({type:'REMAIN_DONE'});
    query = this.props.location.query
    if (query != {}) {
      return generalSearchCreater(query).then((getState) => {
        if (this.props.generalFetching) {
          crawlerSearchCreater(getState)
        }
      })
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
        <label>{generalFetching?<LinearProgress mode="determinate" value={ (hotelList.length!=0&&generalFetching)?(competeList.length/hotelList.length*100):0 } />:false }</label><br />
        <label>{generalFetching?<CircularProgress size={0.5} style={{display:'inline-block', marginRight:'30'}}/>:false}{hotelList.length!=0&&generalFetching?<div style={{display:'inline-block'}}>Found {hotelList.length} hotels in request area, current search BRG for {competeList.length}/{hotelList.length}</div>:(generalFetching?<div style={{display:'inline-block'}}>Fetching Property List in reuqest area</div>:false)}</label><br />
        {competeList.map(
          function(result, index){
            return <HotelListEntry key={uuid.v1()} hotel={hotelList[index]} compete={result} redirectSearch={redirectSearchCreater} query={query} redirectList={redirectList}/>
          }
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(SearchPage)
