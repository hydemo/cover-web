import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Card, Tooltip, Button,message } from 'antd';
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
    this.timer=null;
    this.monitorChart=null;
    this.resize.bind(this);
  }



  // window.onresize = null;
  componentDidMount() {
   

    this.screenChange();

   setTimeout(()=>
   {const chartHeight= this.monitorChart.clientHeight;
    console.log(chartHeight,'chartHeight')
     this.setState({chartHeight})},10)
   
    this.fetchCounts();
    this.timer= setInterval(()=>this.fetchCounts(),1000*60*2);
    const { AMap } = window;
    this.map = new AMap.Map('myMap', { zoom: 12 });
    const styleObjectArr = [
      {
        url: wellGreen,
        anchor: new AMap.Pixel(0, 0),
        size: new AMap.Size(20, 20),
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
      const title = `窨井编号:<span style="font-size:11px;color:#F00;">${e.data.wellSN}</span>`;
      const content = [];
      const infoWindow = new AMap.InfoWindow({
        isCustom: true, // 使用自定义窗体
        content: this.createInfoWindow(title, content.join('<br/>')),
        offset: new AMap.Pixel(22, -12),
      });
      infoWindow.open(this.map, [e.data.lnglat.lng, e.data.lnglat.lat]);
      this.setState({ wellLoc: [e.data.lnglat.lng, e.data.lnglat.lat], wellData: e.data });
    });
    // this.show('getAllWell', 0);
    this.show('getAllWell', 0)
  }

  componentWillUnmount() { 
    if(this.timer){
      clearInterval(this.timer)
    }

    
      
  window.removeEventListener('resize',this.resize);

  }


  resize=()=>{
    // console.log(this.state.chartHeight,'resizexxxxxxxxxxx')
   
     setTimeout(()=>{
      const chartHeight= this.monitorChart.clientHeight;
      console.log(chartHeight,'chartHeight')
       this.setState({chartHeight})
     },1000)
  }

  // 构建自定义信息窗体
  createInfoWindow=(title, content) => {
    const info = document.createElement('div');
    info.className = 'custom-info input-card content-window-card';
 
    // 可以通过下面的方式修改自定义窗体的宽高
    info.style.width = '150px';
    // 定义顶部标题
    const top = document.createElement('div');
    const titleD = document.createElement('div');
    const closeX = document.createElement('img');
    top.className = 'info-top';
    titleD.innerHTML = title;
    closeX.src = 'https://webapi.amap.com/images/close2.gif';
    closeX.onclick = this.closeInfoWindow;
 
    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);
 
    
 
    // 定义中部内容
    const nav = document.createElement('div');
    nav.className = 'info-seeCover';
    nav.style.backgroundColor = 'white';
    nav.innerHTML = '<div style="padding-left:6px;cursor:pointer;color:blue;height:30px;line-height:30px">显示路线</div>';
    info.appendChild(nav);
    nav.onclick = this.nav;
    return info;
  }
 
   closeInfoWindow=() => {
     this.map.clearInfoWindow();
   }

   screenChange=() =>{
    window.addEventListener('resize', this.resize);}

   getWarnType=(status)=>{
      if(status){
        const {
          batteryLevel,coverIsOpen,gasLeak
        }=status
        if( batteryLevel<20){return 1};
        if( gasLeak){return 2};
        if(coverIsOpen){return 3};
      }
      return 0;
   }

   nav=() => {
    const { AMap } = window;
    const { map } = this;
    map.plugin('AMap.Geolocation', () => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：5s
        buttonPosition: 'RB', // 定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: false, // 定位成功后是否自动调整地图视野到定位点
        panToLocation: false,
      });

      map.addControl(geolocation);
      geolocation.getCurrentPosition((status, result) => {
        if (status === 'complete') {
          const myLoc = result.position;
          AMap.plugin('AMap.Driving', () => {
            const driving = new AMap.Driving({
              policy: AMap.DrivingPolicy.LEAST_TIME, // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
              map, // map 指定将路线规划方案绘制到对应的AMap.Map对象上
              autoFitView: true,

            });
            const startLngLat = myLoc;
            const endLngLat = this.state.wellLoc;
            driving.clear();
            driving.search(startLngLat, endLngLat, (status1, result1) => {
              if(status1==="error"){
                message.error('无法定位您的位置！')
              }
              console.log(result1, status1,'xxx');
              this.closeInfoWindow();
            });
          });
        } else {
          console.log(result, 'resultresult');
          message.error('无法定位您的位置！')
        }
      });
    });
  }

  fetchCounts = () => {
    console.log('is counting')
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/getWarnsCount`,
      payload: {},
      callBack: () => {}})}


  show = (action, IconStyle) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/${action}`,
      payload: {},
      callBack: (r) => {
        console.log(r,'rrrrrrrrrrrrrrr')
        if(r){
          const data = r;
          let CenterLng = 0;
          let CenterLat = 0;
          for (let i = 0; i < data.length; i += 1) {
            data[i].lnglat = [data[i].longitude, data[i].latitude];
            data[i].name = data[i].wellSN;
            data[i].id = i;
            if(IconStyle===0){
              data[i].style = this.getWarnType(data[i].status);
            }else{
              data[i].style = IconStyle;
            }
            
            CenterLng += parseFloat(data[i].longitude);
            CenterLat += parseFloat(data[i].latitude);
          }
          if (data.length) {
            this.map.setCenter([CenterLng / data.length, CenterLat / data.length]);
          }
          this.massMarks.setData(data); // 将数组设置到 massMarks 图层
          this.massMarks.setMap(this.map); // 将 massMarks 添加到地图实例
        }
      
      },
    });
  }

  render() {
    const { loading,monitor={} } = this.props;
    const {counts={}}=monitor;
    const {open=0,battery=0,leak=0}=counts;
    console.log(counts,'dddddddddddddddddd')
    const { wellData = {} } = this.state;
    const { status = {} } = wellData;
    const { amplitude = 0, batteryLevel = 0, coverIsOpen = false, distance = 0, frequency = 0, gasLeak = false, photoresistor = 0 } = status;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title={
                <div className={styles.headers}>
                  <div className={styles.headerleft}>
                    <img src={leaks} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    {leak}
                    <div style={{ width: 20 }} />
                    <img src={opens} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    {open}
                    <div style={{ width: 20 }} />
                    <img src={lowbatter} alt="" style={{ width: 20, height: 20 }} />
                    <div style={{ width: 10 }} />
                    {battery}
                  </div>


                  <div className={styles.headermiddle}>
                    <div style={{ width: 10 }} />
                    <Button type='primary' onClick={()=>this.show('getAllWell', 0)}>全部</Button>
                    <div style={{ width: 20 }} />
                    <div style={{ width: 10 }} />
                    <Button type='primary' onClick={() => this.show('getWellBattery', 1)}>电量不足</Button>
                    <div style={{ width: 20 }} />
                    <div style={{ width: 10 }} />
                    <Button type='primary' onClick={() => this.show('getWellLeak', 2)}>  燃气泄漏</Button>
                    <div style={{ width: 20 }} />
                    <div style={{ width: 10 }} />
                    <Button type='primary' onClick={() => this.show('getWellOpen', 3)}>  井盖打开</Button>
                  </div>


                  <div className={styles.headerright}>
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
              title="窨井基本状态"
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              {/* <ActiveChart /> */}

              <div className={styles.wellInfoItem}>
                <div style={{ width: '40%' }}>电量</div>
                <div style={{ width: '40%' }}><MiniProgress percent={batteryLevel / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '20%',paddingLeft:'10%' }}>{`${(batteryLevel ).toFixed(1)}`}</div>
              </div>
              <div className={styles.wellInfoItem}>
                <div style={{ width: '40%' }}>超声波频率</div>
                <div style={{ width: '40%' }}><MiniProgress percent={frequency / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '20%',paddingLeft:'10%' }}>{`${(photoresistor ).toFixed(1)}`}</div>
              </div>
              <div className={styles.wellInfoItem}>
                <div style={{ width: '40%' }}>超声波振幅</div>
                <div style={{ width: '40%' }}><MiniProgress percent={amplitude / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '20%',paddingLeft:'10%' }}>{`${(amplitude ).toFixed(1)}`}</div>
              </div>
              <div className={styles.wellInfoItem}>
                <div style={{ width: '40%'}}>距离:</div>
                <div style={{ width: '40%' }}><MiniProgress percent={distance / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '20%' ,paddingLeft:'10%'}}>{`${(distance).toFixed(1)}`}</div>
              </div>
              <div className={styles.wellInfoItem}>
                <div style={{ width: '40%' }}>电位</div>
                <div style={{ width: '40%' }}><MiniProgress percent={photoresistor / 255 * 100} strokeWidth={12} target={100} /></div>
                <div style={{ width: '20%',paddingLeft:'10%' }}>{`${(photoresistor ).toFixed(1)}`}</div>
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
                  style={{color: 'red'}}
                />
              </div>
              <div
                className={styles.status}
                ref={(node) =>{ this.monitorChart = node}}
              >

                {gasLeak ? <img className={styles.chart} src={leakWarn} alt='' /> :
                <img src={unleak} className={styles.chart} alt='' />}
                {coverIsOpen ? <img className={styles.chart} src={coveropen} alt='' /> : 
                <img src={coverok} className={styles.chart} alt='' />}
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
              <Data chartType='battery' id={this.state.wellData? this.state.wellData._id:''} />
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
