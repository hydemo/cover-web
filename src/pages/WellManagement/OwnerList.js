import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
} from 'antd';

import BaseTable from '@/components/BaseTable';

import styles from './Index.less';

const nameSpace = "ownerList"

const FormItem = Form.Item;
const roleType = { superAdmin: 1, Admin: 2, Operation: 3, User: 4 }
const authority = JSON.parse(localStorage.getItem('cover-authority'))
const role = roleType[authority[0]]
const CreateForm = Form.create()(props => {
  const { form, record } = props;
  return (
    <div>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="业主ID">
        {
          form.getFieldDecorator('ownerId', {
            rules: [{ required: true, message: '请输入业主ID' }],
            initialValue: record.ownerId,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="业主名称">
        {
          form.getFieldDecorator('ownerName', {
            rules: [{ required: true, message: '请输入业主名称' }],
            initialValue: record.ownerName,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="业主性质">
        {
          form.getFieldDecorator('ownerProperty', {
            rules: [{ required: false, message: '请输入业主性质' }],
            initialValue: record.ownerProperty,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="办公地址">
        {
          form.getFieldDecorator('location', {
            rules: [{ required: false, message: '请输入办公地址' }],
            initialValue: record.location,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="法人">
        {
          form.getFieldDecorator('legalPerson', {
            rules: [{ required: false, message: '请输入法人' }],
            initialValue: record.legalPerson,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系人">
        {
          form.getFieldDecorator('contact', {
            rules: [{ required: true, message: '请输入联系人' }],
            initialValue: record.contact,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系电话">
        {
          form.getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入联系电话' }],
            initialValue: record.phone,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系地址">
        {
          form.getFieldDecorator('contactAddress', {
            rules: [{ required: false, message: '请输入联系地址' }],
            initialValue: record.contactAddress,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系邮箱">
        {
          form.getFieldDecorator('email', {
            rules: [{ required: false, message: '请输入联系邮箱' }],
            initialValue: record.email,
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
      title: '业主ID',
      dataIndex: 'ownerId',
    },
    {
      title: '业主名称',
      dataIndex: 'ownerName',
    },
    {
      title: '联系人',
      dataIndex: 'contact',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
  ];



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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="基本搜索">
              {getFieldDecorator('base')(<Input placeholder="" />)}
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
