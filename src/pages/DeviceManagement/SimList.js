import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  DatePicker,
} from 'antd';
import moment from 'moment';

import BaseTable from '@/components/BaseTable';


import styles from './Index.less';

const nameSpace = "simList"

const FormItem = Form.Item;
const roleType = { superAdmin: 1, Admin: 2, Operation: 3, User: 4 }
const authority = JSON.parse(localStorage.getItem('cover-authority'))
const role = roleType[authority[0]]

const CreateForm = Form.create()(props => {
  const { form, record } = props;
  return (
    <div>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="卡号">
        {
          form.getFieldDecorator('cardNumber', {
            rules: [{ required: true, message: '卡号' }],
            initialValue: record.cardNumber,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="运营商">
        {
          form.getFieldDecorator('operator', {
            rules: [{ required: true, message: '请输入运营商' }],
            initialValue: record.operator,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="资费开始时间">
        {
          form.getFieldDecorator('tariffStartTime', {
            rules: [{ required: false, message: '请输入资费开始时间' }],
            initialValue: record.tariffStartTime ? moment(record.tariffStartTime) : null,
          })(<DatePicker format="YYYY-MM-DD" placeholder="请选择" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="资费到期时间">
        {
          form.getFieldDecorator('tariffExpireTime', {
            rules: [{ required: false, message: '请输入资费到期时间' }],
            initialValue: record.tariffExpireTime ? moment(record.tariffExpireTime) : null,
          })(<DatePicker format="YYYY-MM-DD" placeholder="请选择" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="累计流量">
        {
          form.getFieldDecorator('tatalFlow', {
            rules: [{ required: false, message: '请输入累计流量' }],
            initialValue: record.tatalFlow,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="累计资费">
        {
          form.getFieldDecorator('tatalTariff', {
            rules: [{ required: false, message: '请输入累计资费' }],
            initialValue: record.tatalTariff,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {
          form.getFieldDecorator('status', {
            rules: [{ required: false, message: '请输入状态' }],
            initialValue: record.status,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
    </div>

  )
});

/* eslint react/no-multi-comp:0 */
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
      title: '卡号',
      dataIndex: 'cardNumber',
    },
    {
      title: '运营商',
      dataIndex: 'operator',
    },
    {
      title: '资费开始时间',
      dataIndex: 'tariffStartTime',
      render: (text, record) => record.tariffStartTime ? moment(record.tariffStartTime).format('YYYY-MM-DD') : null
    },
    {
      title: '资费到期时间',
      dataIndex: 'tariffExpireTime',
      render: (text, record) => record.tariffExpireTime ? moment(record.tariffExpireTime).format('YYYY-MM-DD') : null
    },
    {
      title: '累计流量',
      dataIndex: 'tatalFlow',
    },
    {
      title: '累计资费',
      dataIndex: 'tatalTariff',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
  ];



  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: {},
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

      this.setState({
        formValues: values,
      });

      dispatch({
        type: `${nameSpace}/fetch`,
        payload: values,
      });
    });
  };

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
    const { formValues } = this.state;
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <BaseTable
            add={role && role < 2}
            update={role && role < 2}
            remove={role && role < 2}
            {...this.props}
            formValues={formValues}
            columns={this.columns}
            CreateForm={CreateForm}
            nameSpace={nameSpace}
          />
        </div>
      </Card>
    );
  }
}

export default TableList;
