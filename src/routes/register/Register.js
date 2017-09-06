/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { post } from '../../helpers/request';
import RegisterForm from '../../forms/RegisterForm';
import history from '../../history';
import s from './Register.css';

class Register extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  register = (values) => post('/user', values).then((resp) => {
    localStorage.token = resp.token;
    localStorage.currentUser = JSON.stringify(resp);
    history.push('/timezones');
    return resp;
  });

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <RegisterForm
            onSubmit={this.register}
            dirty
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Register);
