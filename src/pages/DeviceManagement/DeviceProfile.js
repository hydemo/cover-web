import React, { Component } from 'react';
import { Card, Divider } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Description } = DescriptionList;
const nameSpace = 'deviceList'
@connect((state) => ({
  result: state[`${nameSpace}`],
  loading: state.loading.effects[`${nameSpace}/fetch`],
}))
class DeviceProfile extends Component {
  componentDidMount() { }

  render() {
    const { result: { record: device = {} } } = this.props;
    if (!device.deviceSn) {
      router.push('/devicemanagement/devicelist')
    }
    const { simId: sim = {} } = device
    return (
      <PageHeaderWrapper title="设备详情">
        <Card bordered={false}>
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
            <Description col={1} term="电信平台ID">{device.deviceID}</Description>
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DeviceProfile;
