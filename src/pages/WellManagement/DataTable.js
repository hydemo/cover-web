import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Table,
} from 'antd';

/* eslint-disable no-underscore-dangle,react/destructuring-assignment */
@connect((state) => ({
  battery: state.battery,
  amplitude: state.amplitude,
  distance: state.distance,
  photoresistor: state.photoresistor,
  frequency: state.frequency,
  loading: state.loading,
}))
class DataTable extends PureComponent {
  state = {
  };

  componentDidMount() {
    const { wellId } = this.props
    if (wellId)
      this.fetch()
  }


  fetch = () => {
    const { dispatch, type, wellId, nameSpace } = this.props;
    const result = this.props[`${nameSpace}`]
    const { data = {} } = result
    const { pagination } = data;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: {
        type,
        id: wellId,
        offset: pagination.current,
        limit: pagination.pageSize,
      }
    });
  }

  handleTableChange = (newPagination) => {
    const { dispatch, type, wellId, nameSpace } = this.props;
    dispatch({
      type: `${nameSpace}/setPagination`,
      payload: {
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      },
      callback: () => {
        dispatch({
          type: `${nameSpace}/fetch`,
          payload: {
            type,
            id: wellId,
            offset: newPagination.current,
            limit: newPagination.pageSize,
          }
        });
      },
    })
  }

  render() {
    const { loading, nameSpace, ...rest } = this.props;
    const result = this.props[`${nameSpace}`]
    const { data = {} } = result
    const { pagination } = data;

    return (
      <Table
        rowKey={(record) => record._id}
        loading={loading.effects[`${nameSpace}/fetch`]}
        dataSource={data.list}
        pagination={pagination}
        columns={this.columns}
        onChange={this.handleTableChange}
        {...rest}
      />
    );
  }
}

export default DataTable;
