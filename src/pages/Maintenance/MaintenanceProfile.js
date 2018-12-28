import React, { Component } from 'react';
import { Card, Divider } from 'antd';
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
class MaintenanceProfile extends Component {
  componentDidMount() { }

  render() {
    const { result: { record: maintenance = {} } } = this.props;
    const type = { Open: '井盖打开', Leak: '燃气泄漏', Battery: '电池电量不足' }
    const statusType = ['未处理', '已撤防', '已布防', '已反馈']
    return (
      <PageHeaderWrapper title="维修记录详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="维修记录信息" style={{ marginBottom: 32 }}>
            <Description term="窨井编号">{maintenance.wellId ? maintenance.wellId.wellSN : ''}</Description>
            <Description term="设备编号">{maintenance.deviceId ? maintenance.deviceId.deviceSn : ''}</Description>
            <Description term="维修类型">{type[maintenance.warningType]}</Description>
            <Description term="负责人">{maintenance.principal ? maintenance.principal.name : 'null'}</Description>
            <Description term="地点">{maintenance.location}</Description>
            <Description term="发生时间">{maintenance.occurTime ? moment(maintenance.occurTime).format('YYYY-MM-DD mm:ss') : ''}</Description>
            <Description term="接警时间">{maintenance.responseTime ? moment(maintenance.responseTime).format('YYYY-MM-DD mm:ss') : ''}</Description>
            <Description term="恢复时间">{maintenance.recoverTime ? moment(maintenance.recoverTime).format('YYYY-MM-DD mm:ss') : ''}</Description>
            <Description term="反馈时间">{maintenance.feedbackTime ? moment(maintenance.feedbackTime).format('YYYY-MM-DD mm:ss') : ''}</Description>
            <Description term="状态">{statusType[maintenance.status]}</Description>
            <Description />
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

export default MaintenanceProfile;
