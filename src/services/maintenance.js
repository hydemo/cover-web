import axios from '@/utils/request';

export default async function queryMaintenances(query) {
  return axios({
    url: '/maintenances',
    method: 'GET',
    params: query,
  });
}





