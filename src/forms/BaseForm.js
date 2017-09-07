/* eslint-disable import/no-unresolved */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import t from 'tcomb-form';
import { Button } from 'reactstrap';

import styles from '!!isomorphic-style-loader!css-loader?modules=false!./forms.css';
import LoadingButton from '../components/LoadingButton';
import s from './BaseForm.css';

const Form = t.form.Form;

export default function baseForm({
  fields,
  defaultOptions,
  onValidSubmit = null,
  onInvalidSubmit = null,
  submitText = 'Save',
  loadingText = 'Saving',
}) {
  class BaseForm extends React.Component {
    static propTypes = {
      onSubmit: PropTypes.func.isRequired,
      postSubmit: PropTypes.func,
      error: PropTypes.string,
      values: PropTypes.object,
      onDelete: PropTypes.func,
      onCancel: PropTypes.func,
      inline: PropTypes.bool,
      onChange: PropTypes.func,
      disabled: PropTypes.bool,
      children: PropTypes.node,
      dirty: PropTypes.bool,
    };

    static defaultProps = {
      onChange: () => {},
      disabled: false,
      dirty: false,
    };

    constructor(props) {
      super(props);
      const options = Object.assign({}, defaultOptions, {
        disabled: props.disabled === true,
      });
      this.state = {
        value: this.props.values,
        options,
        dirty: props.dirty,
      };
    }

    componentWillReceiveProps(nextProps) {
      const options = this.state.options;
      const newOptions = Object.assign({}, options, {
        error: nextProps.error,
        hasError: nextProps.error != null,
        disabled: nextProps.disabled === true,
      });

      const nextValues = nextProps.values ? nextProps.values : this.state.value;
      this.setState({
        dirty: this.state.dirty || nextProps.dirty,
        options: newOptions,
        value: nextValues,
      });
    }

    onFormChange(value) {
      let dirty = this.state.dirty;
      if (this.form.validate().isValid()) {
        dirty = true;
      } else {
        dirty = false;
      }
      this.setState({ value, dirty });
      this.props.onChange(value);
    }

    onSubmit(evt) {
      evt.preventDefault();

      const result = this.form.validate();
      if (result.isValid()) {
        const formData = Object.assign({}, this.form.getValue());

        const promise = this.props.onSubmit(formData);

        if (promise) {
          return promise.then(success => {
            if (onValidSubmit) {
              onValidSubmit(this);
            }
            if (this.props.postSubmit) {
              this.props.postSubmit();
            }

            // this.setState({ dirty: false });
          }).catch((err) => {
            this.setState({ error: err.message });
            if (onValidSubmit) {
              onValidSubmit(this);
            }
            if (this.props.postSubmit) {
              this.props.postSubmit();
            }
          });
        }
        if (onValidSubmit) {
          onValidSubmit(this);
        }
        this.setState({ dirty: false });

        if (this.props.postSubmit) {
          this.props.postSubmit();
        }

        return promise;
      } else if (onInvalidSubmit) {
        onInvalidSubmit(this);
      }

      return null;
    }

    render() {
      let inlineClass = null;
      if (this.props.inline) {
        inlineClass = 'inline';
      }
      let deleteButton = null;
      if (this.props.onDelete) {
        deleteButton = (
          <LoadingButton
            onClick={() => this.props.onDelete()}
            text="Delete"
            loadingText="Deleting"
            successText="Deleted"
            dirty
            red
          >
            Delete
          </LoadingButton>
        );
      }

      let submitButton = null;
      const successText = this.state.error ? 'Error' : 'Success';
      if (!this.props.disabled) {
        submitButton = (
          <LoadingButton
            onClick={e => this.onSubmit(e)}
            dirty={this.state.dirty}
            text={submitText}
            successText={successText}
            loadingText={loadingText}
          />
        );
      }

      let cancelButton = null;
      if (this.props.onCancel) {
        cancelButton = (
          <Button
            className={s.button}
            color="danger"
            onClick={() => this.props.onCancel()}
            type="button"
          >
            Cancel
          </Button>
        );
      }

      return (
        <form onSubmit={e => this.onSubmit(e)} className={inlineClass}>
          <Form
            ref={form => {
              this.form = form;
            }}
            type={fields}
            options={this.state.options}
            value={this.state.value}
            onChange={values => this.onFormChange(values)}
          />
          {this.props.children}
          <div className={s.error}>
            {this.state.error}
          </div>
          <div className={s.buttons}>
            {submitButton}
            {deleteButton}
            {cancelButton}
          </div>
        </form>
      );
    }
  }

  return withStyles(s)(withStyles(styles)(BaseForm));
}
