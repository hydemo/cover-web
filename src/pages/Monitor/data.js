import ReactEcharts from 'echarts-for-react';
import 'echarts/theme/macarons';
import React, { Component } from 'react';

export default class chart extends Component {
  data = () => {
    const d = [];
    let len = 0;
    while (len < 200) {
      d.push([
        new Date(2014, 9, 1, 0, len * 10000),
        (Math.random() * 30).toFixed(2) - 0,
        (Math.random() * 100).toFixed(2) - 0,
      ]);
      len += 1;
    }
    return d;
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
            params.value[1]}, ${
            params.value[2]}`;
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
          name: 'series1',
          type: 'line',
          showAllSymbol: true,
          symbolSize(value) {
            return Math.round(value[2] / 10) + 2;
          },
          data: this.data(),
        },
      ],
    };
    return (<ReactEcharts option={option} theme="macarons" />);
  }
}
