/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import history from '../../history';

class Navigation extends React.Component {

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    history.push('/login');
  }

  render() {
    const token = typeof (localStorage) !== 'undefined' ? localStorage.token : null;
    const user = (typeof (localStorage) !== 'undefined' && localStorage.currentUser ? JSON.parse(localStorage.currentUser) : null);

    let usersLink = null;
    if (user && user.userType === 'admin') {
      usersLink = (<Link className={cx(s.link, s.highlight)} to="/users">
        Users
      </Link>);
    }
    const loggedIn = (
      <div>
        {usersLink}
        <Link className={cx(s.link, s.highlight)} to="#" onClick={this.logout}>
          Log Out
        </Link>
      </div>
    );

    const loggedOut = (
      <div>
        <Link className={s.link} to="/login">
          Log in
        </Link>
        <span className={s.spacer}>or</span>
        <Link className={cx(s.link, s.highlight)} to="/register">
          Sign up
        </Link>
      </div>
    );

    let nav = loggedOut;
    if (token) {
      nav = loggedIn;
    }

    return (
      <div className={s.root} role="navigation">
        {nav}
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
