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
  Select
} from 'antd';

import BaseTable from '@/components/BaseTable';
import OwnerTable from '@/pages/WellManagement/OwnerList'
import DeviceTable from '@/pages/DeviceManagement/DeviceList'
import Location from '@/components/Location'
/* eslint-disable no-underscore-dangle */
import styles from './Index.less';

const nameSpace = "wellList"

const FormItem = Form.Item;
const { Option } = Select;
const roleType = { superAdmin: 1, Admin: 2, Operation: 3, User: 4 }
let authority = JSON.parse(localStorage.getItem('cover-authority'))
let role = roleType[authority[0]]

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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="井盖材质">
        {
          form.getFieldDecorator('coverMaterial', {
            rules: [{ required: false, message: '请输入井盖材质' }],
            initialValue: record.coverMaterial,
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
            rules: [{ required: true, message: '请输入经度' }],
            initialValue: record.longitude ? Number(record.longitude) : null,
          })(<InputNumber step={0.1} max={180} min={-180} placeholder="请输入" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="纬度">
        {
          form.getFieldDecorator('latitude', {
            rules: [{ required: true, message: '请输入纬度' }],
            initialValue: record.latitude ? Number(record.latitude) : null,
          })(<InputNumber step={0.1} max={90} min={-90} placeholder="请输入" />)
        }
      </FormItem>
      <Location record={record} form={form} />
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
      key: 'wellSN',
    },
    {
      title: '业主id',
      dataIndex: 'ownerId.ownerId',
      key: 'ownerId.ownerId',
    },
    {
      title: '业主名称',
      dataIndex: 'ownerId.ownerName',
      key: 'ownerId.ownerName',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '设备编号',
      dataIndex: 'deviceId.deviceSn',
      key: 'deviceId.deviceSn',
    },
    {
      title: 'SIM卡号',
      dataIndex: 'deviceId.simId.cardNumber',
      key: 'deviceId.simId.cardNumber',
    },
    {
      title: '布防/撤防',
      dataIndex: 'isDefence',
      key: 'isDefence',
      render: (text, record) => record.isDefence ? '布防' : '撤防'
    },
  ];

  componentDidMount() {
    authority = JSON.parse(localStorage.getItem('cover-authority'))
    role = roleType[authority[0]]
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
    role && role < 3 ?
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => this.onExtendAction(key, props)}>
            <Menu.Item key="owner"><a style={{ color: "#1890FF" }}>绑定业主</a></Menu.Item>
            <Menu.Item key="device"><a style={{ color: "#1890FF" }}>绑定设备</a></Menu.Item>
            <Menu.Item key="profile"><a style={{ color: "#1890FF" }}>窨井详情</a></Menu.Item>
          </Menu>
        }
      >
        <a style={{ fontSize: '14px' }}>
          更多 <Icon type="down" />
        </a>
      </Dropdown> :
      <a style={{ fontSize: '14px' }} onClick={() => this.showProfile(props)}>窨井详情</a>
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
              {getFieldDecorator('base')(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="布防/撤防">
              {getFieldDecorator('isDefence')(
                <Select placeholder="请选择" style={{ width: '150px' }}>
                  <Option value={0} key={0}>撤防</Option>
                  <Option value={1} key={1}>布防</Option>
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
            add={role && role < 3}
            update={role && role < 3}
            remove={role && role < 3}
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
