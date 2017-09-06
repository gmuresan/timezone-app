import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


class Clock extends React.Component {
  static propTypes = {
    gmtOffset: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    const time = moment();
    time.utcOffset(props.gmtOffset);
    this.state = {
      date: time,
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      const time = moment();
      time.utcOffset(this.props.gmtOffset);
      this.setState({
        date: time,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div>
        {this.state.date.format('hh:mm:ss A')} GMT
      </div>
    );
  }
}

export default Clock;

