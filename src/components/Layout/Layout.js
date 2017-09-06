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

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';

import Login from '../../routes/login/Login.js';
import s from './Layout.css';
import Header from '../Header';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    let children = this.props.children;

    if (typeof (window) !== 'undefined') {
      if (!window.location.href.includes('login') && !window.location.href.includes('register')) {
        const token = typeof (localStorage) !== 'undefined' ? localStorage.token : null;
        if (!token) {
          children = <Login />;
        }
      }
    }

    return (
      <div>
        <Header />
        {children}
      </div>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
