import React from 'react';
import { compose, withReducer } from 'recompose';
import _ from 'lodash';

import Users from './Users';
import Layout from '../../components/Layout';
import Request from '../../helpers/request';

async function route({ fetch }) {
  const request = new Request(fetch);
  const userData = await request.get('/api/users');

  const reducer = (users, action) => {
    switch (action.type) {
      case 'created':
        users.push(action.user);
        return users;
      case 'updated': {
        const updated = _.find(users, (user) => user.id === action.user.id);
        _.assign(updated, action.user);
        return users;
      }
      case 'deleted':
        _.remove(users, (user) => user.id === action.user.id);
        return users;
      case 'filter':
        return userData.filter(
          (user) => user.name.toLocaleLowerCase().includes(action.filter.toLocaleLowerCase()),
          );
      default:
        return users;
    }
  };

  const createUser = (values, dispatch) => request.post('/user', values).then((user) => {
    dispatch({ type: 'created', user });
  });

  const updateUser = (values, user, dispatch) => request.put(`/api/users/${user.id}`, values).then((updated) => {
    dispatch({ type: 'updated', user: updated });
  });

  const deleteUser = (user, dispatch) => request.dlte(`/api/users/${user.id}`).then(() => {
    dispatch({ type: 'deleted', user });
  });

  // eslint-disable-next-line react/prop-types
  const UserComponent = ({ users, dispatch }) => (
    <Users
      users={users}
      createUser={(values) => createUser(values, dispatch)}
      updateUser={(values, user) => updateUser(values, user, dispatch)}
      deleteUser={(user) => deleteUser(user, dispatch)}
      filterByName={(filter) => dispatch({ type: 'filter', filter })}
    />
    );

  const WithUsers = compose(
    withReducer('users', 'dispatch', reducer, userData),
  )(UserComponent);

  return {
    chunks: ['users'],
    title: 'Users',
    component: (
      <Layout>
        <WithUsers />
      </Layout>
    ),
  };
}

export default route;

