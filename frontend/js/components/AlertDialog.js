import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

/**
 * Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation.
 */
export default class AlertDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };

    this.handleClose = this.handleClose.bind(this);
  }


  handleClose(){
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];

    const {message} = this.props
    return (
      <div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
        {message}
        </Dialog>
      </div>
    );
  }
}
