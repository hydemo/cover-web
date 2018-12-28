import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal
} from 'antd';
/* eslint-disable no-underscore-dangle */
import BaseTable from '@/components/BaseTable';

import styles from './Index.less';

const nameSpace = "accountmanagement"

const FormItem = Form.Item;
const { Option } = Select;
const role = ['超级管理员', '管理员', '运维', '普通用户'];

const CreateForm = Form.create()(props => {
  const { form, record } = props;
  return (
    <div>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {
          form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入姓名' }],
            initialValue: record.name,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
        {
          form.getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入邮箱' }],
            initialValue: record.email,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限">
        {
          form.getFieldDecorator('role', {
            rules: [{ required: true, message: '请选择权限' }],
            initialValue: record.role,
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {role.map((r, key) => <Option value={key}>{r}</Option>)}
            </Select>
          )
        }
      </FormItem>
    </div>
  );
})

/* eslint react/no-multi-comp:0 */
@connect((state) => ({
  result: state[`${nameSpace}`],
  loading: state.loading.effects[`${nameSpace}/fetch`],
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    formValues: {},
    record: {},
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '权限',
      dataIndex: 'role',
      render(val) {
        return <div>{role[val]}</div>;
      },
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

  onPasswordChange = e => {
    this.setState({ password: e.target.value })
  }

  onPasswordReset = () => {
    const { dispatch } = this.props
    const { record, password } = this.state
    dispatch({
      type: `${nameSpace}/password`,
      payload: {
        id: record._id,
        password,
      },
    });
    this.setState({ modalVisble: false })
  }

  ExtendAction = (props) => {
    const { record } = props
    return (<a onClick={() => this.setState({ record, modalVisble: true })}> 修改密码</a>)
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
            <FormItem label="权限搜索">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {role.map((r, key) => <Option value={key} key={r}>{r}</Option>)}
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
    const { formValues, modalVisble } = this.state;
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <BaseTable
            {...this.props}
            formValues={formValues}
            columns={this.columns}
            CreateForm={CreateForm}
            nameSpace={nameSpace}
            ExtendAction={this.ExtendAction}
          />
        </div>
        <Modal
          title="修改密码"
          visible={modalVisble}
          onOk={this.onPasswordReset}
          onCancel={() => this.setState({ modalVisble: false })}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
            <Input onChange={this.onPasswordChange} placeholder="请输入" />
          </FormItem>
        </Modal>
      </Card>
    );
  }
}

export default TableList;
