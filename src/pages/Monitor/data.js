import ReactEcharts from 'echarts-for-react';
import 'echarts/theme/macarons';
import React, { Component } from 'react';
import { connect } from 'dva';

const nameSpace = "monitor"
@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
}))

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
   
  }

componentDidMount(){
  this.fetchHistotyData();
}


componentWillReceiveProps(nextProps) {
 if(nextProps.id!==this.props.id){
  this.fetchHistotyData(nextProps.id,nextProps.type);
 }
}



fetchHistotyData = (nextPropsId,nextPropsType) => {
  const type=nextPropsType||this.props.type;
  const {chartType,dispatch} =this.props;
  const id=nextPropsId||this.props.id;
  if(chartType&&id){
    dispatch({
      type: `${nameSpace}/getHistory`,
      payload:  {
          id,
          limit:10000,
          offset:1,
          type:chartType
        }
     ,
      callBack: (r) => {
        const data=[];
        if(r&&r.list){
          r.list.map((item,index)=>{
          data.push([
          item.createdAt,
          item[type],
          ])
          })
        }
        this.setState({data})
      
      }
    })
  }
}


  render() {
    const option = {
      title: {
        text: '时间坐标折线图',
        subtext: 'dataZoom支持',
      },
      tooltip: {
        trigger: 'item',
        formatter(params) {
          const date = new Date(params.value[0]);
          const data = `${date.getFullYear()}-${
            date.getMonth() + 1}-${
            date.getDate()} ${
            date.getHours()}:${
            date.getMinutes()}`;
          return `${data}<br/>${
            params.value[1]}`;
        },
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      dataZoom: {
        show: true,
        start: 70,
      },
      legend: {
        data: ['series1'],
      },
      grid: {
        y2: 80,
      },
      xAxis: [
        {
          type: 'time',
          splitNumber: 10,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          // name: 'series1',
          type: 'line',
          showAllSymbol: true,
          symbolSize(value) {
            return Math.round(value[2] / 10) + 2;
          },
          data: this.state.data,
        },
      ],
    };
    return (<ReactEcharts option={option} theme="macarons" />);
  }
}

export default Chart;