import axios from '@/utils/request';
import md5 from 'md5'

export default async function fakeAccountLogin(params) {
  const password = md5(params.password);
  return axios({
    url: '/login',
    method: 'POST',
    data: { ...params, password },
  });
}
