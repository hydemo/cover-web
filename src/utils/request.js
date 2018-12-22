import axios from 'axios';
import { notification } from 'antd';
import router from 'umi/router';
import cookies from 'js-cookie';
import { baseURL } from './config';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export default function request(options) {
  const { headers } = options;
  const axiosReq = axios.create({
    timeout: 30000,
    baseURL,
  });

  if (headers) {
    axiosReq.headers = {
      ...axiosReq.headers,
      ...headers,
    };
  }
  /* eslint no-param-reassign:0 */
  axiosReq.interceptors.request.use((params) => {
    if (window.location.pathname.indexOf('/login') < 0) {
      const token = cookies.get('access_token');
      // console.log(token, 'tokentokenxx');
      if (token) {
        params.headers = {
          ...params.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return params;
  });

  axiosReq.interceptors.response.use((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: errortext,
    });
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
  }, (error) => {
    throw error
  });

  return axiosReq(options)
    .catch((e) => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
