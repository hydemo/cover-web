import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Table,
  Select
} from 'antd';
import moment from 'moment';
import styles from './Index.less';

const FormItem = Form.Item;
const { Option } = Select;

const nameSpace = "maintenanceList";
const type = { Open: '井盖打开', Leak: '燃气泄漏', Battery: '电量不足' }
const statusType = ['未处理', '已撤防', '已布防', '已反馈']
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
      title: '窨井编号',
      dataIndex: 'wellId.wellSN',
      key: 'wellId',
    },
    {
      title: '设备编号',
      dataIndex: 'deviceId.deviceSn',
      key: 'device',
    },
    {
      title: '维修类型',
      dataIndex: 'maintenanceType',
      key: 'maintenanceType',
      render: (text, record) => type[record.maintenanceType],

    },
    {
      title: '负责人',
      dataIndex: 'principal.name',
      key: 'principal',
    },
    {
      title: '接警人',
      dataIndex: 'creatorId.name',
      key: 'creator',
    },
    {
      title: '发生时间',
      dataIndex: 'occurTime',
      key: 'occurTime',
      render: (text, record) => moment(record.occurTime).format('YYYY-MM-DD')
    },

    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => statusType[record.status],

    },
    {
      title: '操作',
      width: 80,
      key: 'action',
      render: (text, record) =>
        <a onClick={() => this.onClick(record)}>详情</a>
    },
  ];

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    const { result: { data }, dispatch } = this.props;
    const { pagination } = data;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: {
        offset: pagination.current,
        limit: pagination.pageSize,
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
      type: `${nameSpace}/setPagination`,
      payload: {
        search: {},
      }
    })
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

  onClick = record => {
    const { dispatch } = this.props
    dispatch({
      type: `${nameSpace}/setRecord`,
      payload: record,
    })
    router.push('/maintenance/maintenanceprofile')
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 24 }}>
          <Col md={8} sm={24}>
            <FormItem label="基本搜索">
              {getFieldDecorator('base')(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="维修类型">
              {getFieldDecorator('maintenanceType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="Open" key="Open">井盖打开</Option>
                  <Option value="Leak" key="Leak">燃气泄漏</Option>
                  <Option value="Battery" key="Battery">电量不足</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {statusType.map((r, key) => <Option value={key} key={r}>{r}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>

          </div>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { result: { data }, loading } = this.props;
    const { pagination } = data;
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <Table
            rowKey={(record) => record._id}
            loading={loading}
            dataSource={data.list}
            pagination={pagination}
            columns={this.columns}
            onChange={this.handleTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default TableList;
