import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import s from './ModalForm.css';

export default function modalForm(FormComponent) {
  class ModalForm extends React.Component {
    static propTypes = {
      onValidSubmit: PropTypes.func,
      buttonText: PropTypes.string,
      isOpen: PropTypes.bool,
      onClose: PropTypes.func,
      title: PropTypes.string,
      footer: PropTypes.string,
      children: PropTypes.node,
    };

    static defaultProps = {
      isOpen: false,
      onClose: () => {},
    };

    constructor(props) {
      super(props);

      this.state = {
        isOpen: props.isOpen,
      };
    }

    componentWillReceiveProps(newProps) {
      if (newProps.isOpen !== 'undefined') {
        this.setState({ isOpen: newProps.isOpen });
      }
    }

    postSubmit() {
      this.props.onClose();
      this.setState({ isOpen: false });
    }

    toggle() {
      if (this.state.isOpen) {
        this.props.onClose();
      }

      this.setState({
        isOpen: !this.state.isOpen,
      });
    }

    render() {
      const newProps = Object.assign({}, this.props, {
        postSubmit: () => this.postSubmit(),
      });

      let button = null;
      if (this.props.children) {
        button = React.cloneElement(this.props.children, { onClick: () => this.toggle() });
      } else if (this.props.buttonText) {
        button = (
          <Button
            className={s.button}
            color="primary"
            onClick={() => this.toggle()}
            data-permission="admin"
          >{this.props.buttonText}</Button>
        );
      }

      let header = null;
      if (this.props.title) {
        header = <ModalHeader toggle={() => this.toggle()}>{this.props.title}</ModalHeader>;
      }

      let footer = null;
      if (this.props.footer) {
        footer = (
          <ModalFooter>
            {this.props.footer}
          </ModalFooter>
        );
      }

      return (
        <div>
          {button}
          <Modal className={s.modalForm} isOpen={this.state.isOpen} toggle={() => this.toggle()}>
            {header}
            <ModalBody>
              <FormComponent {...newProps} />
            </ModalBody>
            {footer}
          </Modal>
        </div>
      );
    }
  }


  return withStyles(s)(ModalForm);
}

