/* eslint css-modules/no-unused-class: [2, {markAsUsed: ['disabled']}] */
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'reactstrap';

import s from './LoadingButton.css';

class LoadingButton extends React.Component {
  static propTypes = {
    buttonDisabled: PropTypes.bool,
    text: PropTypes.string,
    loadingText: PropTypes.string,
    successText: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    dirty: PropTypes.bool,
    red: PropTypes.bool,
    white: PropTypes.bool,
    children: PropTypes.node,
    adminOnly: PropTypes.bool,
  };

  static defaultProps = {
    buttonDisabled: false,
    text: 'Save',
    loadingText: 'Saving',
    successText: 'Saved',
    dirty: false,
    red: false,
    white: false,
    adminOnly: true,
  }

  constructor(props) {
    super(props);

    let state = 'clean';
    if (props.dirty) {
      state = 'dirty';
    }
    this.state = {
      saveState: state,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.saveState === 'saving') return;
    if (nextProps.dirty === this.props.dirty) return;
    if (nextProps.dirty) {
      this.setState({ saveState: 'dirty' });
    } else {
      this.setState({ saveState: 'clean' });
    }
  }

  onSubmit(evt) {
    this.setState({ saveState: 'saving' });

    const promise = this.props.onClick(evt);
    if (promise && promise.then) {
      promise.then((success) => {
        this.setState({ saveState: 'saved' });
        if (this.props.dirty) {
          setTimeout(() => {
            if (this.props.dirty) {
              this.setState({ saveState: 'dirty' });
            }
          }, 700);
        }
      }).catch((e) => {
        // this.setState({ saveState: 'error' });
      });
    } else {
      this.setState({ saveState: 'dirty' });
    }
  }

  render() {
    let submitButton = null;
    let submitButtonText = this.props.text;

    let loading = null;
    if (this.state.saveState === 'saved') {
      submitButtonText = this.props.successText;
    } else if (this.state.saveState === 'saving') {
      loading = (<i className={`${this.props.white ? s.teal : ''} fa fa-spinner fa-spin`} aria-hidden="true" />);
      submitButtonText = this.props.loadingText;
    }

    if (this.props.children) {
      submitButtonText = <div className={s.children}>{this.props.children}</div>;
    }

    const id = `loading-button-${this.props.text}`;
    submitButton = (
      <Button
        id={id}
        data-permission={this.props.adminOnly ? 'admin' : ''}
        className={`${s.button} ${this.props.red ? s.red : ''} ${this.props.white ? s.white : ''} ${this.props.buttonDisabled ? s.buttonDisabled : ''}`}
        onClick={(e) => this.onSubmit(e)}
        color="warning"
        disabled={this.state.saveState === 'clean' || this.state.saveState === 'saved' || this.saveState === 'saving'}
        type="submit"
      >{submitButtonText} {loading}</Button>
    );

    const wrapperId = `loading-button-wrapper-${this.props.text}`;

    return (
      <div id={wrapperId} className={s.loadingButton}>
        {submitButton}
      </div>
    );
  }
}

export default withStyles(s)(LoadingButton);

