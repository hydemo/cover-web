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
import Location from '@/components/Location';
import styles from './Index.less';

const nameSpace = "accountmanagement"

const FormItem = Form.Item;
const { Option } = Select;
const role = ['超级管理员', '管理员', '运维', '普通用户'];

const CreateForm = Form.create()(props => {
  const { form, record, type } = props;
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
      {
        type === 'add' ?
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
            {
              form.getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(<Input placeholder="请输入" />)
            }
          </FormItem> : ''
      }
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系电话">
        {
          form.getFieldDecorator('phone', {
            rules: [{ required: false, message: '请输入联系电话' }],
            initialValue: record.phone,
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
              {role.map((r, key) => key !== 0 ?
                <Option value={key} key={r}> {r}</Option> :
                <Option disabled value={key} key={r}> {r}</Option>
              )}
            </Select>
          )
        }
      </FormItem>
      <Location form={form} record={record} />
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
    record: {},
  };

  columns = [
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '权限',
      dataIndex: 'role',
      key: 'role',
      render(val) {
        return <div>{role[val]}</div>;
      },
    },
    {
      title: '区域',
      dataIndex: 'location',
      key: 'location',
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


  onPasswordReset = () => {
    const { dispatch, form } = this.props
    const { record } = this.state
    form.validateFields((err, values) => {
      if (err) return;
      dispatch({
        type: `${nameSpace}/password`,
        payload: {
          id: record._id,
          password: values.password,
        },
      });
      this.setState({ modalVisble: false })
    })
  }

  ExtendAction = (props) => {
    const { record } = props
    return (<a onClick={() => this.setState({ record, modalVisble: true })} style={{ fontSize: '14px' }}> 修改密码</a>)
  }


  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      selectCondition,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="基本搜索">
              {getFieldDecorator('base')(<Input placeholder="姓名/邮箱" />)}
            </FormItem>
          </Col>
          {!selectCondition ?
            <Col md={8} sm={24}>
              <FormItem label="权限搜索">
                {getFieldDecorator('role')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {role.map((r, key) => <Option value={key} key={r}>{r}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col> : ''}
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
    const { form } = this.props
    const { modalVisble } = this.state;
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <BaseTable
            add
            update
            remove
            columns={this.columns}
            CreateForm={CreateForm}
            nameSpace={nameSpace}
            ExtendAction={this.ExtendAction}
            {...this.props}
          />
        </div>
        <Modal
          destroyOnClose
          title="修改密码"
          visible={modalVisble}
          onOk={this.onPasswordReset}
          onCancel={() => this.setState({ modalVisble: false })}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
            {
              form.getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(<Input placeholder="请输入" />)
            }
          </FormItem>
        </Modal>
      </Card>
    );
  }
}

export default TableList;
