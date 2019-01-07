import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { List, Modal, Form, Input, message } from 'antd';

const FormItem = Form.Item;
@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class SecurityView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisble: false,
    };
  }

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      actions: [
        <a onClick={() => this.setState({ modalVisble: true })}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
  ];

  /* eslint-disable no-underscore-dangle */
  handleOk = () => {
    const { dispatch, form, currentUser } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: `user/resetPassword`,
        payload: {
          id: currentUser._id,
          data: values,
        },
        callback: () => message.success('修改成功')
      });

    });

    this.setState({ modalVisble: false })
  }

  render() {
    const { modalVisble } = this.state
    const { form } = this.props
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta stype={{ fontSize: '48px' }} title={item.title} />
            </List.Item>
          )}
        />
        <Modal
          title="分配人员"
          visible={modalVisble}
          onOk={this.handleOk}
          onCancel={() => this.setState({ modalVisble: false })}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="旧密码">
            {
              form.getFieldDecorator('oldPassword', {
                rules: [{ required: true, message: '旧密码' }],
              })(<Input type='password' placeholder="请输入" />)
            }
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
            {
              form.getFieldDecorator('newPassword', {
                rules: [{ required: true, message: '新密码' }],
              })(<Input type='password' placeholder="请输入" />)
            }
          </FormItem>
        </Modal>
      </Fragment>
    );
  }
}

export default SecurityView;
