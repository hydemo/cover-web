import React, { Component } from 'react';
import { Card, Divider } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Description } = DescriptionList;
const nameSpace = 'maintenanceList'
@connect((state) => ({
  result: state[`${nameSpace}`],
  loading: state.loading.effects[`${nameSpace}/fetch`],
}))
class WarningProfile extends Component {
  componentDidMount() { }

  render() {
    const { result: { record: maintenance = {} } } = this.props;
    if (!maintenance.wellId) {
      router.push('/maintenance')
    }
    const { wellId: well = {} } = maintenance
    const { deviceId: device = {} } = maintenance
    const { principal = {} } = maintenance
    const { creatorId: creator = {} } = maintenance
    const type = { Open: '井盖打开', Leak: '燃气泄漏', Battery: '电池电量不足' }
    const statusType = ['未处理', '已撤防', '已布防', '已反馈']
    return (
      <PageHeaderWrapper title="维修记录详情">
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
          <DescriptionList size="large" title="接警人信息" style={{ marginBottom: 32 }}>
            <Description term="姓名">{principal.name}</Description>
            <Description term="邮箱">{principal.email}</Description>
            <Description term="区域">{principal.location}</Description>
            <Description term="联系电话">{principal.phone}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="负责人信息" style={{ marginBottom: 32 }}>
            <Description term="姓名">{creator.name}</Description>
            <Description term="邮箱">{creator.email}</Description>
            <Description term="区域">{creator.location}</Description>
            <Description term="联系电话">{creator.phone}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="维修记录信息" style={{ marginBottom: 32 }}>
            <Description term="维修类型">{type[maintenance.warningType]}</Description>
            <Description term="发生时间">{maintenance.occurTime ? moment(maintenance.occurTime).format('YYYY-MM-DD HH:mm:ss') : ''}</Description>
            <Description term="接警时间">{maintenance.responseTime ? moment(maintenance.responseTime).format('YYYY-MM-DD HH:mm:ss') : ''}</Description>
            <Description term="恢复时间">{maintenance.recoverTime ? moment(maintenance.recoverTime).format('YYYY-MM-DD HH:mm:ss') : ''}</Description>
            <Description term="反馈时间">{maintenance.feedbackTime ? moment(maintenance.feedbackTime).format('YYYY-MM-DD HH:mm:ss') : ''}</Description>
            <Description term="状态">{statusType[maintenance.status]}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="处理方法" col={1} style={{ marginBottom: 32 }}>
            <Description>{maintenance.feedback}</Description>
          </DescriptionList>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WarningProfile;
