import React, {
  Component
} from 'react'
import ReactDOM from 'react-dom';

export default class Maps extends Component {
  constructor(props) {
    super(props);
    const {geo} = this.props;
    const {lat, lng} = geo;

    this.state = {
      mapUrl: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${12}&size=200x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=AIzaSyAlRyz5cd-sWBE0zHSDyrAloUq1Iet8zQo`
    }
  }

  render() {
    const style = {
      width: '200px',
      height: '200px',
    }
    const mapStyles = {
      height:'100%',
      margin: 0,
      padding: 0,
    }
    const {componentKey} = this.props;
    const new_key = 'map'+'-'+componentKey;
    return(
      <div style={style}>
        <img src={this.state.mapUrl} style={style} id={new_key} ref={new_key} />
      </div>
    )
  }
}
