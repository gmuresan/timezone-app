import React from 'react';
import Cookies from 'js-cookie';
import cx from 'classnames';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import history from '../../history';

class Navigation extends React.Component {

  static propTypes = {
    currentUser: PropTypes.object,
  }

  logout = () => {
    Cookies.remove('token');
    Cookies.remove('currentUser');
    history.push('/login');
  }

  render() {
    const token = this.props.currentUser ? this.props.currentUser.token : null;

    let usersLink = null;
    if (this.props.currentUser && (this.props.currentUser.userType === 'admin' || this.props.currentUser.userType === 'manager')) {
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
        <Link className={s.link} to="/register">
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
