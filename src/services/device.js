import axios from '@/utils/request';

export async function addDevice(query) {
  return axios({
    url: '/devices',
    method: 'POST',
    data: query,
  });
}

export async function queryDevices(query) {
  return axios({
    url: '/devices',
    method: 'GET',
    params: query,
  });
}

export async function updateDevice(query) {
  return axios({
    url: `/devices/${query.id}`,
    method: 'PUT',
    data: query.data,
  });
}


export async function removeDevice(query) {
  return axios({
    url: `/devices/${query.id}`,
    method: 'DELETE',
  });
}

export async function bindSim(query) {
  return axios({
    url: `/devices/${query.id}/sim/${query.target}`,
    method: 'PUT',
  });
}
