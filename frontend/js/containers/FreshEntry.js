import React, {
  Component
} from 'react'


import {
  Link
} from 'react-router'

export default class FreshEntry extends Component {
  render() {
    return (
      <div>
          <p>
            justbrg.com is a tool to help people find their BRG for the hotel they want.<br />
            Instead of searching the competitive prices manually, now with justbrg.com you only need to specify the location and the dates then let the tool do all searching.<br />
            Forgot to mention, our tool can also compute the point value and provide you the best strategy to dump your points!! :)<br />
            Register Now and Enjoy your BRG!<br />
            (If you are not familiar with Best Rate Guarantees, you can look at <a href="http://thepointstraveler.com/beginners-guide-to-learn-how-to-travel-for-free-with-miles-and-points/getting-cheap-free-hotel-stay-using-best-rate-guarantees/" target='_blank'>this</a>)
          </p>
      </div>
    )
  }
}
