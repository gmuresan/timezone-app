import React from 'react';
import { compose, withReducer } from 'recompose';
import _ from 'lodash';

import Users from './Users';
import Layout from '../../components/Layout';
import { get, post, put, dlte } from '../../helpers/request';

async function action({ fetch }) {
  const userData = await get('/api/users');
  const reducer = (users, action) => {
    switch (action.type) {
      case 'created':
        users.push(action.user);
        return users;
      case 'updated':
        const user = _.find(users, (user) => user.id === action.user.id);
        _.assign(user, action.user);
        return users;
      case 'deleted':
        _.remove(users, (user) => user.id === action.user.id);
        return users;
      default:
        return users;
    }
  };

  const createUser = (values, dispatch) => post('/user', values).then((user) => {
    dispatch({ type: 'created', user });
  });

  const updateUser = (values, user, dispatch) => put(`/api/users/${user.id}`, values).then((updated) => {
    dispatch({ type: 'updated', user: updated });
  });

  const deleteUser = (user, dispatch) => dlte(`/api/users/${user.id}`).then(() => {
    dispatch({ type: 'deleted', user });
  });

  const UserComponent = ({ users, dispatch }) => (
    <Users
      users={users}
      createUser={(values) => createUser(values, dispatch)}
      updateUser={(values, user) => updateUser(values, user, dispatch)}
      deleteUser={(user) => deleteUser(user, dispatch)}
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

export default action;

