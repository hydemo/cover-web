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
  DatePicker,
  Dropdown,
  Menu,
  Icon,
  Modal,
} from 'antd';
import moment from 'moment';
/* eslint-disable no-underscore-dangle */
import BaseTable from '@/components/BaseTable';
import SimTable from '@/pages/DeviceManagement/SimList'


import styles from './Index.less';

const nameSpace = "deviceList"

const FormItem = Form.Item;
const roleType = { superAdmin: 1, Admin: 2, Operation: 3, User: 4 }
const authority = JSON.parse(localStorage.getItem('cover-authority'))
const role = roleType[authority[0]]
const CreateForm = Form.create()(props => {
  const { form, record } = props;
  return (
    <div>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备编号">
        {
          form.getFieldDecorator('deviceSn', {
            rules: [{ required: true, message: '请输入设备编号' }],
            initialValue: record.deviceSn,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备名称">
        {
          form.getFieldDecorator('deviceName', {
            rules: [{ required: false, message: '请输入设备名称' }],
            initialValue: record.deviceName,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备类型">
        {
          form.getFieldDecorator('deviceType', {
            rules: [{ required: false, message: '请输入设备类型' }],
            initialValue: record.deviceType,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="硬件版本号">
        {
          form.getFieldDecorator('hardwareVersion', {
            rules: [{ required: false, message: '请输入硬件版本号' }],
            initialValue: record.hardwareVersion,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="软件版本号">
        {
          form.getFieldDecorator('softwareVersion', {
            rules: [{ required: false, message: '请输入软件版本号' }],
            initialValue: record.softwareVersion,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="硬件编号">
        {
          form.getFieldDecorator('hardwardSn', {
            rules: [{ required: false, message: '请输入硬件编号' }],
            initialValue: record.hardwardSn,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="安装时间">
        {
          form.getFieldDecorator('installTime', {
            rules: [{ required: false, message: '请输入安装时间' }],
            initialValue: record.installTime ? moment(record.installTime) : null,
          })(<DatePicker format="YYYY-MM-DD" placeholder="请选择" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="使用状态">
        {
          form.getFieldDecorator('status', {
            rules: [{ required: false, message: '请输入使用状态' }],
            initialValue: record.status,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="硬件装配人员">
        {
          form.getFieldDecorator('hardwareInstaller', {
            rules: [{ required: false, message: '请输入硬件装配人员' }],
            initialValue: record.hardwareInstaller,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="软件烧写人员">
        {
          form.getFieldDecorator('softwareWriter', {
            rules: [{ required: false, message: '请输入软件烧写人员' }],
            initialValue: record.softwareWriter,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="安装人员">
        {
          form.getFieldDecorator('installer', {
            rules: [{ required: false, message: '请输入安装人员' }],
            initialValue: record.installer,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="NB模组号">
        {
          form.getFieldDecorator('NBModuleNumber', {
            rules: [{ required: false, message: '请输入NB模组号' }],
            initialValue: record.NBModuleNumber,
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
    record: {}
  };

  columns = [
    {
      title: '设备编号',
      dataIndex: 'deviceSn',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
    },
    {
      title: '安装时间',
      dataIndex: 'installTime',
      render: (text, record) => record.installTime ? moment(record.installTime).format('YYYY-MM-DD') : null
    },
    {
      title: '硬件版本号',
      dataIndex: 'hardwareVersion',
    },
    {
      title: '软件版本号',
      dataIndex: 'softwareVersion',
    },
    {
      title: '使用状态',
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

  onExtendAction = (key, props) => {
    const { record } = props
    const { dispatch } = this.props;
    if (key === 'profile') {
      dispatch({
        type: `${nameSpace}/record`,
        payload: record,
      })
      router.push('/devicemanagement/deviceprofile')
    } else {
      this.setState({ type: key, record, modalVisble: true })
    }
  }

  ExtendAction = (props) => (
    role && role < 2 ?
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => this.onExtendAction(key, props)}>
            <Menu.Item key="sim"><a style={{ color: "#1890FF" }}>绑定sim卡</a></Menu.Item>
            <Menu.Item key="profile"><a style={{ color: "#1890FF" }}>设备详情</a></Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown> :
      <a onClick={() => this.showProfile(props)}>设备详情</a>

  );

  showProfile = (props) => {
    const { record } = props
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/record`,
      payload: record,
    })
    router.push('/devicemanagement/deviceprofile')
  }

  onRowSelect = (record) => {
    this.setState({ target: record })
  };

  handleOk = () => {
    const { record, target, type } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/${type}`,
      payload: {
        id: record._id,
        target: target._id,
      },
      callback: () => { this.fetch() }
    })
    this.setState({ modalVisble: false })
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
    const { formValues, modalVisble } = this.state;
    const rowSelection = {
      type: 'radio',
      onSelect: (record) => this.onRowSelect(record),
    }
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
            ExtendAction={this.ExtendAction}
          />
        </div>
        <Modal
          title="绑定sim卡"
          visible={modalVisble}
          onOk={this.handleOk}
          onCancel={() => this.setState({ modalVisble: false })}
          width="1000px"
        >
          <SimTable add={false} update={false} remove={false} rowSelection={rowSelection} />
        </Modal>
      </Card>
    );
  }
}

export default TableList;
