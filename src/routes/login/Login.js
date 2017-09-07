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

import LoginForm from '../../forms/LoginForm';

import s from './Login.css';

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onLogin: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <p className={s.lead}>
            Log in with your email address
          </p>
          <LoginForm
            dirty
            onSubmit={this.props.onLogin}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Login);
