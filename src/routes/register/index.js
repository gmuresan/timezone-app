/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Cookies from 'js-cookie';
import Layout from '../../components/Layout';
import Register from './Register';
import Request from '../../helpers/request';
import history from '../../history';

const title = 'New User Registration';

async function action({ fetch }) {
  const request = new Request(fetch);

  const onRegister = (values) => request.post('/users', values).then((res) => {
    Cookies.set('token', res.token);
    Cookies.set('currentUser', JSON.stringify(res));
    history.push('/timezones');
  });

  return {
    chunks: ['register'],
    title,
    component: (
      <Layout>
        <Register onRegister={onRegister} title={title} />
      </Layout>
    ),
  };
}

export default action;
