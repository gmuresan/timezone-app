import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Card, CardBlock, CardText, CardTitle, CardSubtitle } from 'reactstrap';
import moment from 'moment';

import s from './Home.css';
import ModalForm from '../../components/ModalForm';
import TimezoneForm from '../../forms/TimezoneForm';
import LoadingButton from '../../components/LoadingButton';
import Clock from '../../components/Clock';

class Home extends React.Component {
  static propTypes = {
    timezones: PropTypes.array.isRequired,
    createTimezone: PropTypes.func.isRequired,
    updateTimezone: PropTypes.func.isRequired,
    deleteTimezone: PropTypes.func.isRequired,
    filterByName: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timezones: [],
  };

  constructor(props) {
    super(props);
    this.timezoneModal = ModalForm(TimezoneForm);

    this.state = {
      time: moment(),
    };
  }

  render() {
    const TzModal = this.timezoneModal;
    const timezones = this.props.timezones.map((tz) => {
      const time = moment(this.state.time);
      time.utcOffset(tz.gmtOffset);
      return (
        <div id={tz.id} className={s.timezone}>
          <Card>
            <CardBlock>
              <div className={s.cardTopRow}>
                <CardTitle>{tz.name}</CardTitle>
                <TzModal
                  onSubmit={(values) => this.props.updateTimezone(values, tz)}
                  buttonText="Edit"
                  title={`Edit ${tz.name}`}
                  values={tz}
                />
              </div>
              <CardSubtitle>City: {tz.city}</CardSubtitle>
              <CardText>GMT Offset: {tz.gmtOffset} hours</CardText>
              Current Time: <Clock gmtOffset={tz.gmtOffset} />
              <LoadingButton
                dirty
                text="Delete"
                loadingText="Deleting"
                successText="Deleted"
                onClick={() => this.props.deleteTimezone(tz)}
                red
              />

            </CardBlock>
          </Card>
        </div>
      );
    });

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div>
            <h3>Timezones</h3>
            <div className={s.topRow}>
              <div>
                Search By Name: <input type="text" onChange={(e) => this.props.filterByName(e.target.value)} />
              </div>
              <this.timezoneModal
                onSubmit={this.props.createTimezone}
                buttonText="New Timezone"
                title="Create Timezone"
              />
            </div>
          </div>
          <div>
            {timezones}
          </div>

        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
