import React from 'react';
import { compose, withReducer } from 'recompose';
import _ from 'lodash';

import Home from './Home';
import Layout from '../../components/Layout';
import { get, post, put, dlte } from '../../helpers/request';

async function action({ fetch }) {
  const tzData = await get('/api/timezones');
  const reducer = (timezones, action) => {
    switch (action.type) {
      case 'created':
        timezones.push(action.timezone);
        return timezones;
      case 'updated':
        const tz = _.find(timezones, (timezone) => timezone.id === action.timezone.id);
        _.assign(tz, action.timezone);
        return timezones;
      case 'deleted':
        _.remove(timezones, (tz) => tz.id === action.timezone.id);
        return timezones;
      default:
        return timezones;
    }
  };

  const createTimezone = (values, dispatch) => post('/api/timezones', values).then((timezone) => {
    dispatch({ type: 'created', timezone });
  });

  const updateTimezone = (values, timezone, dispatch) => put(`/api/timezones/${timezone.id}`, values).then((updated) => {
    dispatch({ type: 'updated', timezone: updated });
  });

  const deleteTimezone = (timezone, dispatch) => dlte(`/api/timezones/${timezone.id}`).then(() => {
    dispatch({ type: 'deleted', timezone });
  });

  const HomeC = ({ timezones, dispatch }) => (
    <Home
      timezones={timezones}
      createTimezone={(values) => createTimezone(values, dispatch)}
      updateTimezone={(values, tz) => updateTimezone(values, tz, dispatch)}
      deleteTimezone={(tz) => deleteTimezone(tz, dispatch)}
    />
    );

  const WithTimezones = compose(
    withReducer('timezones', 'dispatch', reducer, tzData),
  )(HomeC);

  return {
    chunks: ['home'],
    title: 'Timezones',
    component: (
      <Layout>
        <WithTimezones />
      </Layout>
    ),
  };
}

export default action;

