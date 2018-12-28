import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './WellProfile.less';

const { Description } = DescriptionList;

const nameSpace = 'wellList'
@connect((state) => ({
  result: state[`${nameSpace}`],
  loading: state.loading.effects[`${nameSpace}/fetch`],
}))
class WellProfile extends Component {
  componentDidMount() { }

  render() {
    const { result: { record: well = {} } } = this.props;
    if (!well.deviceId) {
      delete well.deviceId
    }
    const { deviceId: device = {} } = well
    const { ownerId: owner = {} } = well
    const { simId: sim = {} } = device || {}
    const { status = {} } = well
    return (
      <PageHeaderWrapper title="窨井详情">
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
          <DescriptionList size="large" title="业主信息" style={{ marginBottom: 32 }}>
            <Description term="业主ID">{owner.ownerId}</Description>
            <Description term="业主名称">{owner.ownerName}</Description>
            <Description term="业主性质">{owner.ownerProperty}</Description>
            <Description term="法人">{owner.legalPerson}</Description>
            <Description term="联系人">{owner.contact}</Description>
            <Description term="联系电话">{owner.phone}</Description>
            <Description term="办公地址">{owner.location}</Description>
            <Description term="联系地址">{owner.contactAddress}</Description>
            <Description term="联系邮箱">{owner.email}</Description>
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
          <DescriptionList size="large" title="sim卡信息" style={{ marginBottom: 32 }}>
            <Description term="卡号">{sim.cardNumber}</Description>
            <Description term="运营商">{sim.operator}</Description>
            <Description term="资费开始时间">{sim.tariffStartTime ? moment(sim.tariffStartTime).format('YYYY-MM-DD') : ''}</Description>
            <Description term="资费到期时间">{sim.tariffExpireTime ? moment(sim.tariffExpireTime).format('YYYY-MM-DD') : ''}</Description>
            <Description term="累计流量">{sim.tatalFlow}</Description>
            <Description term="累计资费">{sim.tatalTariff}</Description>
            <Description term="状态">{sim.status}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="状态信息" style={{ marginBottom: 32 }}>
            <Description term="电量">{status.batteryLevel}</Description>
            <Description term="井盖是否打开">{status.coverIsOpen ? '打开' : '关闭'}</Description>
            <Description term="燃气是否泄漏">{status.gasLeak ? '泄漏' : '未泄漏'}</Description>
            <Description term="光敏检测周期">{status.photoCheckPeriod}</Description>
            <Description term="超声波频率检测周期">{status.freqCheckPeriod}</Description>
            <Description term="位置检测周期">{status.distCheckPeriod}</Description>
            <Description term="超声波频率">{status.frequency}</Description>
            <Description term="超声波振幅">{status.amplitude}</Description>
            <Description term="距离">{status.distance}</Description>
            <Description term="点位">{status.photoresistor}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WellProfile;
