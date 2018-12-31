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



/* eslint react/no-multi-comp:0 */
@Form.create()
class BaseTable extends PureComponent {
  state = {
    modalVisible: false,
    type: 'add',
    record: {},
  };

  componentDidMount() {
    const { columns, update = true, remove = true, ExtendAction } = this.props;

    const action =
    {
      title: '操作',
      width: '200px',
      render: (text, record) => (
        <div>
          {update ?
            <a onClick={() => this.setState({ modalVisible: true, type: 'edit', record })}>
              修改
              <Divider type="vertical" />
            </a> : ''}
          {remove ?
            <Popconfirm title="确定删除？" onConfirm={() => this.handleDelete(record)}>
              <a>删除</a>
              <Divider type="vertical" />
            </Popconfirm> : ''}
          {ExtendAction ? <span><ExtendAction record={record} /></span> : ''}
        </div>
      ),
    }
    if (update || remove || ExtendAction) {
      columns.push(action)
    }
    this.fetch()
  }

  fetch = () => {
    const { result: { data }, dispatch, nameSpace } = this.props;
    const { pagination } = data;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: {
        offset: pagination.current,
        limit: pagination.pageSize,
        search: pagination.search,
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
      form.resetFields();
      dispatch({
        type: `${nameSpace}/add`,
        payload: values,
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
      form.resetFields();
      dispatch({
        type: `${nameSpace}/update`,
        payload: {
          id: _id,
          data: values,
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
        >
          <CreateForm form={form} record={record} type={type} />
        </Modal>
      </Fragment>
    );
  }
}

export default BaseTable;
