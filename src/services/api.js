import { stringify } from 'qs';
import axios from '@/utils/request';

export async function queryProjectNotice() {
  return axios('/api/project/notice');
}

export async function queryActivities() {
  return axios('/api/activities');
}

export async function queryRule(params) {
  return axios(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return axios('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return axios('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return axios('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return axios('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return axios('/api/fake_chart_data');
}

export async function queryTags() {
  return axios('/api/tags');
}

export async function queryBasicProfile() {
  return axios('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return axios('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return axios(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return axios(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return axios(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return axios(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return axios({
    url: '/login',
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return axios({
    url: '/devices',
    method: 'GET',
    params,
  });
}

export async function queryNotices() {
  return axios('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return axios(`/api/captcha?mobile=${mobile}`);
}
