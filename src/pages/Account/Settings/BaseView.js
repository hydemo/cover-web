import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Button } from 'antd';
import { connect } from 'dva';
import cookies from 'js-cookie';
import styles from './BaseView.less';
import { baseURL } from '@/utils/config';

/* eslint-disable no-underscore-dangle */
const token = cookies.get('access_token');
const FormItem = Form.Item;
// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar, onChange }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload onChange={onChange} showUploadList={false} action={`${baseURL}/user/upload`} headers={{ Authorization: `Bearer ${token}` }}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarUrl: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    };
  }

  componentDidMount() {
    this.setBaseInfo();
    this.getAvatarURL()
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  onChange = (info) => {
    const { dispatch } = this.props;
    if (info.file.status === 'done') {
      dispatch({
        type: 'user/fetchCurrent',
        callback: () => this.getAvatarURL()
      });
    }
  }

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      this.setState({
        avatarUrl: currentUser.avatar,
      });
    }

  }

  getViewDom = ref => {
    this.view = ref;
  };


  handleSubmit = () => {
    const { dispatch, form, currentUser } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      dispatch({
        type: `user/updateMe`,
        payload: { data: values, id: currentUser._id },
        callback: () => {
          dispatch({
            type: 'user/fetchCurrent',
          });
        }
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { avatarUrl } = this.state;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <Button type="primary" onClick={() => this.handleSubmit()}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView onChange={this.onChange} avatar={avatarUrl} />
        </div>
      </div>
    );
  }
}

export default BaseView;
