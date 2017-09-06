import React from 'react';
import { compose, withReducer } from 'recompose';
import _ from 'lodash';

import Home from './Home';
import Layout from '../../components/Layout';
import { get, post, put, dlte } from '../../helpers/request';

async function route(context, params) {
  const currentUserId = typeof (localStorage) !== 'undefined' && localStorage.currentUser ? JSON.parse(localStorage.currentUser).id : null;
  const userId = params.userId ? params.userId : currentUserId;
  const tzData = await get(`/api/users/${userId}/timezones`);
  const reducer = (timezones, action) => {
    switch (action.type) {
      case 'created':
        timezones.push(action.timezone);
        return timezones;
      case 'updated': {
        const tz = _.find(timezones, (timezone) => timezone.id === action.timezone.id);
        _.assign(tz, action.timezone);
        return timezones;
      }
      case 'deleted':
        _.remove(timezones, (tz) => tz.id === action.timezone.id);
        return timezones;
      case 'filter':
        return tzData.filter(
          (tz) => tz.name.toLocaleLowerCase().includes(action.filter.toLocaleLowerCase()),
        );
      default:
        return timezones;
    }
  };

  const createTimezone = (values, dispatch) => post(`/api/users/${userId}/timezones`, values).then((timezone) => {
    dispatch({ type: 'created', timezone });
  });

  const updateTimezone = (values, timezone, dispatch) => put(`/api/users/${userId}/timezones/${timezone.id}`, values).then((updated) => {
    dispatch({ type: 'updated', timezone: updated });
  });

  const deleteTimezone = (timezone, dispatch) => dlte(`/api/users/${userId}/timezones/${timezone.id}`).then(() => {
    dispatch({ type: 'deleted', timezone });
  });

  // eslint-disable-next-line react/prop-types
  const HomeC = ({ timezones, dispatch }) => (
    <Home
      timezones={timezones}
      createTimezone={(values) => createTimezone(values, dispatch)}
      updateTimezone={(values, tz) => updateTimezone(values, tz, dispatch)}
      deleteTimezone={(tz) => deleteTimezone(tz, dispatch)}
      filterByName={(filter) => dispatch({ type: 'filter', filter })}
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

export default route;

