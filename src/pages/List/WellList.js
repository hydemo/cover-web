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
} from 'antd';

import BaseTable from '@/components/BaseTable';

import styles from './Index.less';

const nameSpace = "wellList"

const FormItem = Form.Item;
const { Option } = Select;
const role = ['超级管理员', '管理员', '运维', '普通用户'];

const CreateForm = Form.create()(props => {
  const { form } = props;
  return (
    <FormItem
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}
      label="描述"
    >
      {
        form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)
      }
    </FormItem>)
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
      // filters: [
      //   {
      //     text: role[0],
      //     value: 0,
      //   },
      //   {
      //     text: role[1],
      //     value: 1,
      //   },
      //   {
      //     text: role[2],
      //     value: 2,
      //   },
      //   {
      //     text: role[3],
      //     value: 3,
      //   },
      // ],
      render(val) {
        console.log(role, val)
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
    const { formValues } = this.state;
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
          />
        </div>
      </Card>
    );
  }
}

export default TableList;
