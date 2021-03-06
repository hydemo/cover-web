import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Button,
  Popconfirm,
  Modal,
  message,
  Divider,
  Table
} from 'antd';



/* eslint-disable react/no-multi-comp:0,no-underscore-dangle */
@Form.create()
class BaseTable extends PureComponent {
  state = {
    modalVisible: false,
    type: 'add',
    record: {},
  };

  componentDidMount() {
    const { columns, update = true, remove = true, ExtendAction, dispatch, nameSpace, selectCondition } = this.props;
    const action =
    {
      title: '操作',
      width: '200px',
      render: (text, record) => (
        <div>
          {update ?
            <a style={{ fontSize: '14px' }} onClick={() => this.setState({ modalVisible: true, type: 'edit', record })}>
              修改
              <Divider type="vertical" />
            </a> : ''}
          {remove ?
            <Popconfirm title="确定删除？" onConfirm={() => this.handleDelete(record)}>
              <a style={{ fontSize: '14px' }}>删除</a>
              <Divider type="vertical" />
            </Popconfirm> : ''}
          {ExtendAction ? <span><ExtendAction record={record} /></span> : ''}
        </div>
      ),
    }
    if (update || remove || ExtendAction) {
      columns.push(action)
    }
    dispatch({
      type: `${nameSpace}/setPagination`,
      payload: {
        search: { ...selectCondition }
      },
    })
    this.fetch({ ...selectCondition })
  }

  fetch = (search) => {
    const { result: { data }, dispatch, nameSpace } = this.props;
    const { pagination } = data;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: {
        offset: pagination.current,
        limit: pagination.pageSize,
        search: search || pagination.search,
      }
    });
  }

  handleTableChange = (newPagination) => {
    const { dispatch, nameSpace, result: { data }, } = this.props;
    const { pagination } = data;
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
            offset: newPagination.current,
            limit: newPagination.pageSize,
            search: pagination.search,
          }
        });
      }
    })
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = () => {
    const { dispatch, nameSpace, form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      let value = values;
      if (values.location && values.location.length) {
        value = { ...values, location: values.location.toString().replace(/,/g, '-') }
      }
      form.resetFields();
      dispatch({
        type: `${nameSpace}/add`,
        payload: value,
        callback: () => {
          this.fetch()
        }
      });
      message.success('添加成功');
      this.handleModalVisible();
    });
  };

  handleUpdate = () => {
    const { dispatch, nameSpace, form } = this.props;
    const { record } = this.state;
    const { _id } = record;
    form.validateFields((err, values) => {
      if (err) return;
      let value = values;
      if (values.location && values.location.length) {
        value = { ...values, location: values.location.toString().replace(/,/g, '-') }
      }
      form.resetFields();
      dispatch({
        type: `${nameSpace}/update`,
        payload: {
          id: _id,
          data: value,
        },
        callback: () => {
          this.fetch()
        }
      });
      message.success('编辑成功');
      this.handleModalVisible();
    });
  };

  handleDelete = (record) => {
    const { dispatch, nameSpace } = this.props;
    const { _id } = record;
    dispatch({
      type: `${nameSpace}/remove`,
      payload: {
        id: _id,
      },
      callback: () => {
        this.fetch()
      }
    });
    message.success('删除成功');
    this.handleModalVisible();
  }

  render() {
    const {
      result: { data = {} } = {},
      loading,
      rowSelection,
      CreateForm,
      columns,
      form,
      add = true,
      ...rest
    } = this.props;
    const { modalVisible, type, record } = this.state;
    const { pagination } = data;

    return (
      <Fragment>
        {add ?
          <Button icon="plus" type="primary" style={{ marginBottom: 16 }} onClick={() => this.handleModalVisible(true)}>
            新建
          </Button> : ''}
        <Table
          rowKey={(re) => re._id}
          loading={loading}
          rowSelection={rowSelection}
          dataSource={data.list}
          pagination={pagination}
          columns={columns}
          onChange={this.handleTableChange}
          {...rest}
        />
        <Modal
          destroyOnClose
          afterClose={() => this.setState({ type: 'add', record: {} })}
          title={type === 'add' ? "新增" : "修改"}
          visible={modalVisible}
          onOk={type === 'add' ? this.handleAdd : this.handleUpdate}
          onCancel={() => this.handleModalVisible()}
          width='700px'
        >
          <CreateForm form={form} record={record} type={type} />
        </Modal>
      </Fragment>
    );
  }
}

export default BaseTable;
