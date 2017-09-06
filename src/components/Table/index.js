/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-unresolved */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import reactVirtualizedStyles from '!!isomorphic-style-loader!css-loader?modules=false!react-virtualized/styles.css';

import { SortDirection, AutoSizer, Table } from 'react-virtualized';
import _ from 'lodash';
import s from './Table.css';

class TableComp extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    getColumns: PropTypes.func.isRequired,
    selectedItem: PropTypes.object,
    sortBy: PropTypes.string,
    emptyStateText: PropTypes.string,
  };

  static defaultProps = {
    emptyStateText: 'No Items Available',
  };

  constructor(props) {
    super(props);

    this.state = {
      items: props.items,
      sortBy: props.sortBy,
      sortDirection: SortDirection.ASC,
    };

    this.sort = this.sort.bind(this);
    this.renderEmptyRow = this.renderEmptyRow.bind(this);
  }

  componentWillReceiveProps(newProps) {
    // if (newProps.items.length !== this.state.items.length) {
    this.setState({ items: newProps.items }, () => {
      const sortBy = this.state.sortBy;
      const sortDirection = this.state.sortDirection;
      this.sort({ sortBy, sortDirection });
    });
    // }
  }

  getItem(index) {
    if (this.state.items.length === 0) return {};
    return this.state.items[index];
  }

  getRowClassName(index) {
    let className = null;
    if (index % 2 === 0) {
      className = s.rowEven;
    } else {
      className = s.rowOdd;
    }

    if (this.props.selectedItem) {
      const item = this.getItem(index);
      if (item && this.props.selectedItem.id === item.id) {
        className += ` ${s.selectedRow}`;
      }
    }

    return className;
  }

  sort({ sortBy, sortDirection }) {
    let items = _.sortBy(this.state.items, (item => item[sortBy]));
    if (sortDirection === SortDirection.DESC) {
      items = items.reverse();
    }

    this.setState({ sortBy, sortDirection, items });
  }

  renderEmptyRow() {
    return (
      <div className={s.emptyStateRow}>
        {this.props.emptyStateText}
      </div>
    );
  }

  render() {
    return (
      <div className={s.border}>
        <AutoSizer>
          {({ height, width }) => {
            const rowHeight = 45;
            const itemCount = this.state.items.length;
            const props = {};

            return (
              <Table
                sort={this.sort}
                sortBy={this.state.sortBy}
                sortDirection={this.state.sortDirection}
                headerHeight={50}
                height={height}
                width={width - 2}
                rowCount={itemCount}
                rowHeight={rowHeight}
                rowGetter={({ index }) => this.getItem(index)}
                headerClassName={s.tableHeader}
                rowClassName={({ index }) => this.getRowClassName(index)}
                className={s.tableT}
                noRowsRenderer={this.renderEmptyRow}
                {...props}
              >

                {this.props.getColumns(width)}

              </Table>
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}

export default withStyles(reactVirtualizedStyles)(withStyles(s)(TableComp));

