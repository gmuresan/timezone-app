import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import moment from 'moment';
import { Column } from 'react-virtualized';

import s from './Users.css';
import ModalForm from '../../components/ModalForm';
import { buildForm } from '../../forms/UserForm';
import LoadingButton from '../../components/LoadingButton';
import Table from '../../components/Table';
import Link from '../../components/Link';

class Users extends React.Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    createUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    filterByName: PropTypes.func.isRequired,
  };

  static defaultProps = {
    users: [],
  };

  constructor(props) {
    super(props);

    this.currentUser = typeof (localStorage) === 'undefined' && localStorage.currentUser ? {} : JSON.parse(localStorage.currentUser);
    this.editUserModal = ModalForm(buildForm(false, this.currentUser.userType === 'admin'));
    this.newUserModal = ModalForm(buildForm(true, this.currentUser.userType === 'admin'));

    this.state = {
      time: moment(),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      /*
      this.setState({
        time: moment(),
      });
      */
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getColumns(width) {
    const numColumns = 4;
    return [
      <Column
        dataKey="name"
        key="name"
        width={width / numColumns}
        label="Name"
        cellRenderer={(data) => this.nameCell(data)}
      />,
      <Column
        dataKey="email"
        key="email"
        width={width / numColumns}
        label="Email"
      />,
      <Column
        dataKey="userType"
        key="userType"
        width={width / numColumns}
        label="User Type"
      />,
      <Column
        dataKey="button"
        key="button"
        disableSort
        width={width / numColumns}
        label="&nbsp;"
        cellRenderer={(data) => this.buttonCell(data)}
      />,
    ];
  }

  nameCell({ rowData, rowIndex }) {
    let name = rowData.name;
    if (this.currentUser.userType === 'admin') {
      name = <Link to={`/timezones/${rowData.id}`}>{rowData.name}</Link>;
    }
    return name;
  }

  buttonCell({ rowData, rowIndex }) {
    const button = (
      <div className={s.buttonCell}>
        <this.editUserModal
          onSubmit={(values) => this.props.updateUser(values, rowData)}
          buttonText="Edit"
          title={`Edit ${rowData.name}`}
          values={rowData}
        />
        <LoadingButton
          dirty
          text="Delete"
          red
          onClick={() => this.props.deleteUser(rowData)}
        />
      </div>
    );

    return (
      <div style={{ marginLeft: 10 }} className={s.buttonCell}>
        {button}
      </div>
    );
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h3>Users</h3>
          <div className={s.topRow}>
            <div>
              Search By Name: <input type="text" onChange={(e) => this.props.filterByName(e.target.value)} />
            </div>
            <this.newUserModal
              onSubmit={this.props.createUser}
              buttonText="New User"
              title="Create User"
            />
          </div>

          <div style={{ height: 400 }}>
            <Table
              items={this.props.users}
              getColumns={(width) => this.getColumns(width)}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default withStyles(s)(Users);
