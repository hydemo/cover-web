import axios from '@/utils/request';

export default async function queryMaintenances(query) {
  return axios({
    url: '/maintenances/all',
    method: 'GET',
    params: query,
  });
}





