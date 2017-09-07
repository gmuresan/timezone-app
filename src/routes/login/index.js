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
import Login from './Login';
import Request from '../../helpers/request';
import history from '../../history';

const title = 'Log In';

async function action({ fetch }) {
  const request = new Request(fetch);

  const onLogin = (values) => request.post('/session', values).then((res) => {
    Cookies.set('token', res.token);
    Cookies.set('currentUser', JSON.stringify(res));
    history.push('/timezones');
  });

  return {
    chunks: ['login'],
    title,
    component: (
      <Layout>
        <Login onLogin={onLogin} title={title} />
      </Layout>
    ),
  };
}

export default action;
