import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Table,
  Modal,
  Divider,
  Popconfirm,
  Select
} from 'antd';
import AccountTable from '@/pages/AccountManagement'

import styles from './Index.less';

const FormItem = Form.Item;
const { Option } = Select;

const nameSpace = "warning";

const type = { Open: '井盖打开', Leak: '燃气泄漏', Battery: '电量不足' }
const roleType = { superAdmin: 1, Admin: 2, Operation: 3, User: 4 }
const authority = JSON.parse(localStorage.getItem('cover-authority'))
const role = roleType[authority[0]]
/* eslint-disable no-underscore-dangle */
@connect((state) => ({
  result: state[`${nameSpace}`],
  loading: state.loading.effects[`${nameSpace}/fetch`],
}))
@Form.create()
class TableList extends PureComponent {
  state = {
  };



  columns = [
    {
      title: '异常类型',
      dataIndex: 'warningType',
      key: 'warningType',
      render: (text, record) => type[record.warningType],

    },
    {
      title: '电池电量',
      dataIndex: 'batteryLevel',
      key: 'batteryLevel',
      render: (text, record) => {
        if (record.batteryLevel < 20) {
          return <div style={{ color: 'red' }}>{record.batteryLevel}</div>;
        }
        return record.batteryLevel;
      },
    },
    {
      title: '井盖是否打开',
      dataIndex: 'coverIsOpen',
      key: 'coverIsOpen',
      render: (text, record) => {
        if (record.coverIsOpen) {
          return <div style={{ color: 'red' }}>打开</div>;
        }
        return '关闭';
      },

    }, {
      title: '是否泄气',
      dataIndex: 'gasLeak',
      key: 'gasLeak',
      render: (text, record) => {
        if (record.gasLeak) {
          return <div style={{ color: 'red' }}>漏气</div>;
        }
        return '未漏气';
      },
    },
    {
      title: '是否分配',
      dataIndex: 'isHandle',
      key: 'isHandle',
      render: (text, record) => record.isHandle ? '是' : '否'

    },
  ]

  actionText =
    {
      title: '操作',
      width: 200,
      key: 'action',
      render: (text, record) =>
        <div>
          {record.isHandle ?
            <div>
              <span style={{ color: '#A9A9A9' }}>接警</span>
              <Divider type="vertical" />
              <span style={{ color: '#A9A9A9' }}>撤警</span>
            </div>
            :
            <div>
              <a onClick={() => this.setState({ modalVisble: true, record })}>接警</a>
              <Divider type="vertical" />
              <Popconfirm title="确定撤警？" onConfirm={() => this.cancelWarning(record)}>
                <a>撤警</a>
              </Popconfirm>
            </div>
          }

        </div>

    };


  componentDidMount() {
    if (role && role < 3) {
      this.columns.push(this.actionText)
    }
    this.fetch()
  }

  cancelWarning = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/cancel`,
      payload: { id: record._id },
      callback: () => {
        this.fetch()
      }
    });
  }

  fetch = () => {
    const { result: { data }, dispatch } = this.props;
    const { pagination } = data;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: {
        offset: pagination.current,
        limit: pagination.pageSize,
        search: pagination.search
      }
    });
  }

  handleTableChange = (newPagination) => {
    const { dispatch, result: { data } } = this.props;
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
      },
    })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    const { result: { data } } = this.props;
    const { pagination } = data;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: {
        offset: pagination.current,
        limit: pagination.pageSize,
      }
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      const { result: { data } } = this.props;
      const { pagination } = data;
      dispatch({
        type: `${nameSpace}/setPagination`,
        payload: {
          search: values,
        }
      })
      dispatch({
        type: `${nameSpace}/fetch`,
        payload: {
          offset: pagination.current,
          limit: pagination.pageSize,
          search: values,
        }
      });
    });
  };

  onRowSelect = (record) => {
    this.setState({ user: record })
  }


  handleOk = () => {
    const { record, user } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/bind`,
      payload: { id: record._id, userId: user._id },
      callback: () => {
        this.fetch()
      }
    });
    this.setState({ modalVisble: false })
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="异常类型">
              {getFieldDecorator('warningType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="Open" key="Open">井盖打开</Option>
                  <Option value="Leak" key="Leak">燃气泄漏</Option>
                  <Option value="Battery" key="Battery">电量不足</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电池电量">
              {getFieldDecorator('batteryLevel')(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否打开">
              {getFieldDecorator('coverIsOpen')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={0} key={0}>关闭</Option>
                  <Option value={1} key={1}>打开</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="是否泄气">
              {getFieldDecorator('gasLeak')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={0} key={0}>漏气</Option>
                  <Option value={1} key={1}>未漏气</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否分配">
              {getFieldDecorator('isHandle')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={0} key={0}>否</Option>
                  <Option value={1} key={1}>是</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { modalVisble } = this.state;
    const { result: { data } = {}, loading } = this.props;
    const { pagination } = data;
    const rowSelection = {
      type: 'radio',
      onSelect: (record) => this.onRowSelect(record),
    }
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <Table
            rowKey={(record)=>record._id}
            loading={loading}
            dataSource={data.list}
            pagination={pagination}
            columns={this.columns}
            onChange={this.handleTableChange}
          />
          <Modal
            title="分配人员"
            visible={modalVisble}
            onOk={this.handleOk}
            onCancel={() => this.setState({ modalVisble: false })}
            width="1000px"
          >
            <AccountTable add={false} update={false} remove={false} rowSelection={rowSelection} />
          </Modal>
        </div>
      </Card>
    );
  }
}

export default TableList;
