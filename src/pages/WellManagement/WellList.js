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
  InputNumber,
  Menu,
  Modal,
  Dropdown,
  Icon,
} from 'antd';

import BaseTable from '@/components/BaseTable';
import OwnerTable from '@/pages/WellManagement/OwnerList'
import DeviceTable from '@/pages/DeviceManagement/DeviceList'

/* eslint-disable no-underscore-dangle */
import styles from './Index.less';

const nameSpace = "wellList"

const FormItem = Form.Item;

const roleType = { superAdmin: 1, Admin: 2, Operation: 3, User: 4 }
const authority = JSON.parse(localStorage.getItem('cover-authority'))
const role = roleType[authority[0]]

const CreateForm = Form.create()(props => {
  const { form, record } = props;
  return (
    <div>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="窨井编号">
        {
          form.getFieldDecorator('wellSN', {
            rules: [{ required: true, message: '窨井编号' }],
            initialValue: record.wellSN,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="窨井类型">
        {
          form.getFieldDecorator('wellType', {
            rules: [{ required: false, message: '请输入窨井类型' }],
            initialValue: record.wellType,
          })(<Input placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="井壁口径">
        {
          form.getFieldDecorator('wellCaliber', {
            rules: [{ required: false, message: '请输入井壁口径' }],
            initialValue: record.wellCaliber ? Number(record.wellCaliber) : null,
          })(<InputNumber step={0.1} placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="井盖口径">
        {
          form.getFieldDecorator('coverCaliber', {
            rules: [{ required: false, message: '请输入井盖口径' }],
            initialValue: record.coverCaliber ? Number(record.coverCaliber) : null,
          })(<InputNumber step={0.1} placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="窨井深度">
        {
          form.getFieldDecorator('wellDepth', {
            rules: [{ required: false, message: '请输入窨井深度' }],
            initialValue: record.wellDepth ? Number(record.wellDepth) : null,
          })(<InputNumber step={0.1} placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="经度">
        {
          form.getFieldDecorator('longitude', {
            rules: [{ required: false, message: '请输入经度' }],
            initialValue: record.longitude ? Number(record.longitude) : null,
          })(<InputNumber step={0.1} placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="纬度">
        {
          form.getFieldDecorator('latitude', {
            rules: [{ required: false, message: '请输入纬度' }],
            initialValue: record.latitude ? Number(record.latitude) : null,
          })(<InputNumber step={0.1} placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="位置">
        {
          form.getFieldDecorator('location', {
            rules: [{ required: false, message: '请输入位置' }],
            initialValue: record.location,
          })(<Input placeholder="请输入" />)
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
    type: 'owner',
    record: {},
  };

  columns = [
    {
      title: '窨井编号',
      dataIndex: 'wellSN',
    },
    {
      title: '业主id',
      dataIndex: 'ownerId.ownerId',
    },
    {
      title: '业主名称',
      dataIndex: 'ownerId.ownerName',
    },
    {
      title: '窨井类型',
      dataIndex: 'wellType',
    },
    {
      title: '位置',
      dataIndex: 'location',
    },
    {
      title: '布防/撤防',
      dataIndex: 'isDefence',
      render: (text, record) => record.isDefence ? '布防' : '撤防'
    },
  ];

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
      router.push('/wellmanagement/wellprofile')
    } else {
      this.setState({ type: key, record, modalVisble: true })
    }
  }

  ExtendAction = (props) => (
    role && role < 2 ?
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => this.onExtendAction(key, props)}>
            <Menu.Item key="owner"><a style={{ color: "#1890FF" }}>绑定业主</a></Menu.Item>
            <Menu.Item key="device"><a style={{ color: "#1890FF" }}>绑定设备</a></Menu.Item>
            <Menu.Item key="profile"><a style={{ color: "#1890FF" }}>窨井详情</a></Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown> :
      <a onClick={() => this.showProfile(props)}>窨井详情</a>
  )

  showProfile = (props) => {
    const { record } = props
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/record`,
      payload: record,
    })
    router.push('/wellmanagement/wellprofile')
  }

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

  onRowSelect = (record) => {
    this.setState({ target: record })
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
    const { formValues, type, modalVisble } = this.state;
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
            formValues={formValues}
            columns={this.columns}
            CreateForm={CreateForm}
            nameSpace={nameSpace}
            ExtendAction={this.ExtendAction}
            {...this.props}
          />
        </div>
        <Modal
          title={type === 'owner' ? "绑定业主" : "绑定设备"}
          visible={modalVisble}
          onOk={this.handleOk}
          onCancel={() => this.setState({ modalVisble: false })}
          width="1000px"
        >
          {
            type === 'owner' ?
              <OwnerTable add={false} update={false} remove={false} rowSelection={rowSelection} /> :
              <DeviceTable add={false} update={false} remove={false} rowSelection={rowSelection} />
          }
        </Modal>
      </Card>
    );
  }
}

export default TableList;
