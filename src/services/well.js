import axios from '@/utils/request';

export async function addWell(query) {
  return axios({
    url: '/wells',
    method: 'POST',
    data: query,
  });
}

export async function queryWells(query) {
  return axios({
    url: '/wells',
    method: 'GET',
    params: query,
  });
}

export async function updateWell(query) {
  return axios({
    url: `/wells/${query.id}`,
    method: 'PUT',
    data: query.data,
  });
}


export async function removeWell(query) {
  return axios({
    url: `/wells/${query.id}`,
    method: 'DELETE',
  });
}

export async function bindOwner(query) {
  return axios({
    url: `/wells/${query.id}/owner/${query.target}`,
    method: 'PUT',
  });
}

export async function bindDevice(query) {
  return axios({
    url: `/wells/${query.id}/device/${query.target}`,
    method: 'PUT',
  });
}


