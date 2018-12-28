import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Card, Tooltip, Button } from 'antd';
import { Pie, WaterWave, Gauge, TagCloud, MiniProgress } from '@/components/Charts';
// import { MiniProgress } from '../../components/Charts/MiniProgress';
// import NumberInfo from '@/components/NumberInfo';
// import CountDown from '@/components/CountDown';
// import ActiveChart from '@/components/ActiveChart';
// import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import Authorized from '@/utils/Authorized';
import styles from './Index.less';
import Data from './data';

const nameSpace = "monitor"
const wellGreen = require('../../assets/images/wellGreen.png');
const wellRed = require('../../assets/images/wellRed.png');
const wellPurple = require('../../assets/images/wellPurple.png');
const wellBlue = require('../../assets/images/wellBlue.png');
const leakWarn = require('../../assets/images/leak.png');
const unleak = require('../../assets/images/unleak.png');
const coveropen = require('../../assets/images/coveropen.png');
const coverok = require('../../assets/images/coverok.png');

const leaks = require('../../assets/images/leaks.png');
const opens = require('../../assets/images/opens.png');
const lowbatter = require('../../assets/images/lowbatter.png');

const { Secured } = Authorized;

// const targetTime = new Date().getTime() + 3900000;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 300);
});

@Secured(havePermissionAsync)
@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
}))
class Monitor extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      wellData: {}
    };
  }


  componentDidMount() {
    // const { dispatch } = this.props;
    // // console.log(window.AMap)
    // dispatch({
    //   type: 'monitor/fetchTags',
    // });

    const { AMap } = window;
    this.map = new AMap.Map('myMap', { zoom: 12 });
    const styleObjectArr = [
      {
        url: wellGreen,
        anchor: new AMap.Pixel(0, 0),
        size: new AMap.Size(20, 20),
        // offset: new AMap.Pixel(-10, -100),
      },
      {
        url: wellRed,
        anchor: new AMap.Pixel(0, 0),
        size: new AMap.Size(20, 20),
      },
      {
        url: wellPurple,
        anchor: new AMap.Pixel(0, 0),
        size: new AMap.Size(20, 20),
      },
      {
        url: wellBlue,
        anchor: new AMap.Pixel(0, 0),
        size: new AMap.Size(20, 20),
      },
    ];
    // 实例化 AMap.MassMarks
    this.massMarks = new AMap.MassMarks(this.map, {
      zIndex: 5,
      cursor: 'pointer',
      style: styleObjectArr,
    });

    AMap.event.addListener(this.massMarks, 'click', (e) => {
      // const title = `窑井编号:<span style="font-size:11px;color:#F00;">${e.data.wellSN}</span>`;
      // const content = [];
      // content.push(`业主名称： ${e.data.ownerName}`);
      // content.push(`窑井类型： ${e.data.wellType}`);
      // content.push(`窑井大小：${e.data.wellCaliber}`);
      // content.push(`窑井深度：${e.data.wellDepth}`);
      // content.push(`窑井位置：${e.data.location}`);
      // content.push(`窑井经度：${e.data.longitude}`);
      // content.push(`窑井纬度：${e.data.latitude}`);
      // content.push('');

      // const infoWindow = new AMap.InfoWindow({
      //   isCustom: true, // 使用自定义窗体
      //   content: this.createInfoWindow(title, content.join('<br/>')),
      //   offset: new AMap.Pixel(22, -12),
      // });
      // infoWindow.open(this.map, [e.data.lnglat.lng, e.data.lnglat.lat]);
      this.setState({ wellLoc: [e.data.lnglat.lng, e.data.lnglat.lat], wellData: e.data });
    });
    // this.show('getAllWell', 0);
    this.show('getAllWell', 0)
  }

  show = (action, IconStyle) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/${action}`,
      payload: {},
      callBack: (r) => {
        const data = r;
        let CenterLng = 0;
        let CenterLat = 0;
        for (let i = 0; i < data.length; i += 1) {
          data[i].lnglat = [data[i].longitude, data[i].latitude];
          data[i].name = data[i].wellSN;
          data[i].id = i;
          data[i].style = IconStyle;
          CenterLng += parseFloat(data[i].longitude);
          CenterLat += parseFloat(data[i].latitude);
        }
        if (data.length) {
          this.map.setCenter([CenterLng / data.length, CenterLat / data.length]);
        }
        this.massMarks.setData(data); // 将数组设置到 massMarks 图层
        this.massMarks.setMap(this.map); // 将 massMarks 添加到地图实例
      },
    });
  }

  render() {
    const { loading } = this.props;
    const { wellData = {} } = this.state;
    const { status = {} } = wellData;
    const { amplitude = 0, batteryLevel = 0, coverIsOpen = false, distance = 0, frequency = 0, gasLeak = false, photoresistor = 0 } = status;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title={
                // <FormattedMessage
                //   id="app.monitor.trading-activity"
                //   defaultMessage="Real-Time Trading Activity"
                // />
                <div className={styles.headers}>
                  <div className={styles.headerleft}>
                    <img src={leaks} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    12
                    <div style={{ width: 20 }} />
                    <img src={opens} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    32
                    <div style={{ width: 20 }} />
                    <img src={lowbatter} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    5
                  </div>


                  <div className={styles.headermiddle}>
                    {/* <img src={wellGreen} alt="" style={{ width: 20, height: 20 }} /> */}
                    <div style={{ width: 10 }} />
                    <Button type='primary'>全部</Button>
                    <div style={{ width: 20 }} />
                    {/* <img src={wellRed} alt="" style={{ width: 20, height: 20 }} /> */}
                    <div style={{ width: 10 }} />
                    <Button type='primary'>电量不足</Button>
                    <div style={{ width: 20 }} />
                    {/* <img src={wellPurple} alt="" style={{ width: 20, height: 20 }} /> */}
                    <div style={{ width: 10 }} />
                    <Button type='primary'>  燃气泄漏</Button>
                    <div style={{ width: 20 }} />
                    {/* <img src={wellBlue} alt="" style={{ width: 20, height: 20 }} /> */}
                    <div style={{ width: 10 }} />
                    <Button type='primary'>  井盖打开</Button>
                  </div>


                  <div className={styles.header}>
                    <img src={wellGreen} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    正常
                    <div style={{ width: 20 }} />
                    <img src={wellRed} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    电量不足
                    <div style={{ width: 20 }} />
                    <img src={wellPurple} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    燃气泄漏
                    <div style={{ width: 20 }} />
                    <img src={wellBlue} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    井盖打开
                  </div>

                </div>
              }
              bordered={false}
            >
              <div className={styles.mapChart}>
                <div className={styles.myMap} id='myMap' />
              </div>
            </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="窑井基本状态"
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              {/* <ActiveChart /> */}

              <div className={styles.wellInfoItem}>
                <div style={{ width: '80px' }}>电量</div>
                <div style={{ width: '180px' }}><MiniProgress percent={batteryLevel / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '30px' }}>{`${(batteryLevel / 255 * 100).toFixed(2)}%`}</div>
              </div>
              <div className={styles.wellInfoItem}>
                <div style={{ width: '80px' }}>超声波频率</div>
                <div style={{ width: '180px' }}><MiniProgress percent={frequency / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '30px' }}>{`${(photoresistor / 255 * 100).toFixed(2)}%`}</div>
              </div>
              <div className={styles.wellInfoItem}>
                <div style={{ width: '80px' }}>超声波振幅</div>
                <div style={{ width: '180px' }}><MiniProgress percent={amplitude / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '30px' }}>{`${(amplitude / 255 * 100).toFixed(2)}%`}</div>
              </div>
              <div className={styles.wellInfoItem}>
                <div style={{ width: '80px' }}>距离:</div>
                <div style={{ width: '180px' }}><MiniProgress percent={distance / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '30px' }}>{`${(distance / 255 * 100).toFixed(2)}%`}</div>
              </div>
              <div className={styles.wellInfoItem}>
                <div style={{ width: '80px' }}>电位</div>
                <div style={{ width: '180px' }}><MiniProgress percent={photoresistor / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '30px' }}>{`${(photoresistor / 255 * 100).toFixed(2)}%`}</div>
              </div>
            </Card>
            <Card
              title="监控状态"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >

              <div style={{ textAlign: 'center' }}>
                <WaterWave
                  height={161}
                  title="电池电量"
                  percent={(batteryLevel / 255 * 100).toFixed(0)}
                />
              </div>
              <div className={styles.status}>

                {gasLeak ? <img src={leakWarn} alt='' /> : <img src={unleak} alt='' />}
                {coverIsOpen ? <img src={coveropen} alt='' /> : <img src={coverok} alt='' />}
              </div>

            </Card>

          </Col>
        </Row>

        <Row gutter={24}>
          <Col xl={12} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title="电量趋势图"
              bordered={false}
              className={styles.pieCard}
            >
              <Data nameSpace='' />
            </Card>
          </Col>
          <Col xl={12} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>


            <Card
              title="超声波振幅趋势图"
            >
              <Data nameSpace='' />
            </Card>
          </Col>

          <Col xl={12} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title="超声波频率趋势图"
              bodyStyle={{ textAlign: 'center', fontSize: 0 }}
              bordered={false}
            >
              <Data nameSpace='' />
            </Card>
          </Col>


          <Col xl={12} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title="距离趋势图"
              bodyStyle={{ textAlign: 'center', fontSize: 0 }}
              bordered={false}
            >
              <Data nameSpace='' />
            </Card>
          </Col>

          <Col xl={12} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title="电位趋势图"
              bodyStyle={{ textAlign: 'center', fontSize: 0 }}
              bordered={false}
            >
              <Data nameSpace='' />
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Monitor;
