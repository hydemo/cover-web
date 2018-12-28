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
} from 'antd';
import moment from 'moment';
import styles from './Index.less';

const FormItem = Form.Item;

const nameSpace = "maintenanceList";
const type = { Open: '井盖打开', Leak: '燃气泄漏', Battery: '电池电量不足' }
const statusType = ['未处理', '已撤防', '已布防', '已反馈']
/* eslint-disable no-underscore-dangle */
@connect((state) => ({
  result: state[`${nameSpace}`],
  loading: state.loading.effects[`${nameSpace}/fetch`],
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    formValues: {},
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
      title: '异常类型',
      dataIndex: 'warningType',
      key: 'warningType',
      render: (text, record) => type[record.warningType],

    },
    {
      title: '负责人',
      dataIndex: 'principal.name',
      key: 'principal',
    },
    {
      title: '发生时间',
      dataIndex: 'occurTime',
      key: 'occurTime',
      render: (text, record) => moment(record.occurTime).format('YYYY-MM-DD')
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => statusType[record.status],

    },
    {
      title: '操作',
      width: 150,
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
    const { dispatch } = this.props;
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
          }
        });
      }
    })
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetch()
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      this.fetch()
    });
  };

  onClick = record => {
    const { dispatch } = this.props
    dispatch({
      type: `${nameSpace}/record`,
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="基本搜索">
              {getFieldDecorator('name')(<Input placeholder="姓名/邮箱/地址" />)}
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
    const { result: { data }, loading } = this.props;
    const { pagination } = data;
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <Table
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
