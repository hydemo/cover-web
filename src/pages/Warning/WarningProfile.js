import React, { Component } from 'react';
import { Card, Divider } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Description } = DescriptionList;
const nameSpace = 'warning'
@connect((state) => ({
  result: state[`${nameSpace}`],
  loading: state.loading.effects[`${nameSpace}/fetch`],
}))
class WarningProfile extends Component {
  componentDidMount() { }

  render() {
    const { result: { record: warning = {} } } = this.props;
    if (!warning.wellId) {
      router.push('/warning')
    }
    const { wellId: well = {} } = warning
    const { deviceId: device = {} } = warning
    const { handler = {} } = warning
    const handleType = ['接警', '撤警']
    const type = { Open: '井盖打开', Leak: '燃气泄漏', Battery: '电池电量不足' }
    return (
      <PageHeaderWrapper title="告警详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="窨井信息" style={{ marginBottom: 32 }}>
            <Description term="窨井编号">{well.wellSN}</Description>
            <Description term="窨井类型">{well.wellType}</Description>
            <Description term="井壁口径">{well.wellCaliber}</Description>
            <Description term="井盖口径">{well.coverCaliber}</Description>
            <Description term="窨井深度">{well.wellDepth}</Description>
            <Description term="经度">{well.longitude}</Description>
            <Description term="纬度">{well.latitude}</Description>
            <Description term="位置">{well.location}</Description>
            <Description term="布防/撤防">{well.isDefence ? '布防' : '撤防'}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="设备信息" style={{ marginBottom: 32 }}>
            <Description term="设备编号">{device.deviceSn}</Description>
            <Description term="设备名称">{device.deviceName}</Description>
            <Description term="设备类型">{device.deviceType}</Description>
            <Description term="硬件版本号">{device.hardwareVersion}</Description>
            <Description term="软件版本号">{device.softwareVersion}</Description>
            <Description term="硬件编号">{device.hardwardSn}</Description>
            <Description term="安装时间">{device.installTime ? moment(device.installTime).format('YYYY-MM-DD') : ''}</Description>
            <Description term="使用状态">{device.status}</Description>
            <Description term="硬件装配人员">{device.hardwareInstaller}</Description>
            <Description term="软件烧写人员">{device.softwareWriter}</Description>
            <Description term="安装人员">{device.installer}</Description>
            <Description term="NB模组号">{device.NBModuleNumber}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          {
            warning.isHandle ?
              <DescriptionList size="large" title="处理人信息" style={{ marginBottom: 32 }}>
                <Description term="姓名">{handler.name}</Description>
                <Description term="邮箱">{handler.email}</Description>
                <Description term="区域">{handler.location}</Description>
                <Description term="联系电话">{handler.phone}</Description>
              </DescriptionList>
              : ''
          }
          {
            warning.isHandle ?
              <Divider style={{ marginBottom: 32 }} />
              : ''
          }
          <DescriptionList size="large" title="告警信息" style={{ marginBottom: 32 }}>
            <Description term="告警类型">{type[warning.warningType]}</Description>
            <Description term="电量水平">{warning.batteryLevel}</Description>
            <Description term="井盖是否打开">{warning.coverIsOpen ? '打开' : '关闭'}</Description>
            <Description term="是否漏气">{warning.gasLeak ? '漏气' : '未漏气'}</Description>
            <Description term="是否处理">{warning.isHandle ? '是' : '否'}</Description>
            <Description term="处理时间">{warning.handleTime ? moment(warning.handleTime).format('YYYY-MM-DD hh:mm:ss') : ''}</Description>
            <Description term="处理办法">{warning.handleType || warning.handleType === 0 ? handleType[warning.handleType] : ''}</Description>
            <Description />
          </DescriptionList>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WarningProfile;
