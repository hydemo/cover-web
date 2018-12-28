import axios from '@/utils/request';

export async function addOwner(query) {
  return axios({
    url: '/owners',
    method: 'POST',
    data: query,
  });
}

export async function queryOwners(query) {
  return axios({
    url: '/owners',
    method: 'GET',
    params: query,
  });
}

export async function updateOwner(query) {
  return axios({
    url: `/owners/${query.id}`,
    method: 'PUT',
    data: query.data,
  });
}


export async function removeOwner(query) {
  return axios({
    url: `/owners/${query.id}`,
    method: 'DELETE',
  });
}
