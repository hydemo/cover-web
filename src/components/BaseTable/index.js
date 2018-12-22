import React, { PureComponent } from 'react';
import {
  Form,
  Button,
  Popconfirm,
  Modal,
  message,
  Divider,
  Table
} from 'antd';


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
/* eslint react/no-multi-comp:0 */
@Form.create()
class BaseTable extends PureComponent {
  state = {
    modalVisible: false,
    type: 'add',
    record: {},
  };

  componentDidMount() {
    const { dispatch, columns, update = true, remove = true, ExtendAction, nameSpace } = this.props;
    console.log(nameSpace, 'vaaaa')
    const action =
    {
      title: '操作',
      width: '180px',
      render: (text, record) => (
        <div>
          {update ? <a onClick={() => this.setState({ modalVisible: true, type: 'edit', record })}>修改</a> : ''}
          {remove ?
            <Popconfirm title="确定删除？" onConfirm={this.handleDelete}>
              <Divider type="vertical" />
              <a>删除</a>
            </Popconfirm> : ''}
          {ExtendAction ? <div><Divider type="vertical" /><ExtendAction /></div> : ''}
        </div>
      ),
    }
    if (update || remove) {
      columns.push(action)
    }
    dispatch({
      type: `${nameSpace}/fetch`,
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, formValues, nameSpace } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: `${nameSpace}/fetch`,
      payload: params,
    });
  };

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
        payload: {
          values,
        },
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
      });
      message.success('编辑成功');
      this.handleUpdateModalVisible();
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
    });
    message.success('删除成功');
    this.handleUpdateModalVisible();
  }

  render() {
    const {
      result: { data },
      loading,
      rowSelection,
      CreateForm,
      columns,
      form,
      add = true,
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      pageSize: 10,
      total: data.total,
    };
    const { modalVisible, type } = this.state;

    return (
      <div>
        {add ?
          <Button icon="plus" type="primary" style={{ marginBottom: 16 }} onClick={() => this.handleModalVisible(true)}>
            新建
          </Button> : ''}
        <Table
          loading={loading}
          rowSelection={rowSelection}
          dataSource={data.list}
          pagination={paginationProps}
          columns={columns}
          onChange={this.handleTableChange}
        />
        <Modal
          destroyOnClose
          title={type === 'add' ? "新增" : "修改"}
          visible={modalVisible}
          onOk={type === 'add' ? this.handleAdd : this.handleUpdate}
          onCancel={() => this.handleModalVisible()}
        >
          <CreateForm form={form} />
        </Modal>
      </div>
    );
  }
}

export default BaseTable;
