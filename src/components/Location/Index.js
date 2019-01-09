import React, {
  PureComponent
} from 'react';

import {
  Cascader,
  Form
} from 'antd';

import axios from 'axios';

const FormItem = Form.Item;


class Location extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };

  }


  componentDidMount() {
    this.getCity();
  }

  getCity = () => {
    axios.get(
      'https://restapi.amap.com/v3/config/district?key=2df64031affa2bcb7370bbc93591df60&subdistrict=3')
      .then((response) => {
        if (response.status === 200) {
          this.setState({ province: response.data.districts[0].districts })
        }
      })
      .catch((error) => {
        throw (error)
      });
  }



  render() {
    const { form, record = {} } = this.props;

    const { province = [] } = this.state;
    const options = [];
    for (let i = 0; i < province.length; i += 1) {
      const tmpProvince = {};
      tmpProvince.value = province[i].name;
      tmpProvince.label = province[i].name;
      tmpProvince.children = [];
      for (let j = 0; j < province[i].districts.length; j += 1) {
        const tmpCity = {};
        tmpCity.value = province[i].districts[j].name;
        tmpCity.label = province[i].districts[j].name;
        tmpCity.children = [];

        for (let k = 0; k < province[i].districts[j].districts.length; k += 1) {
          const tmpZoom = {};
          tmpZoom.value = province[i].districts[j].districts[k].name;
          tmpZoom.label = province[i].districts[j].districts[k].name;
          tmpCity.children.push(tmpZoom);
        }
        tmpProvince.children.push(tmpCity)
      }
      options.push(tmpProvince)
    }

    return (
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="位置">
        {
          form.getFieldDecorator('location', {
            rules: [{ required: true, message: '请选择位置' }],
            initialValue: record && record.location ? record.location.split('-') : [],
          })(<Cascader style={{ width: '100%' }} placeholder="请选择位置" options={options} />)
        }
      </FormItem>
    );
  }
}

export default Location;
