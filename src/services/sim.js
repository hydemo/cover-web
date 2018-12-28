import axios from '@/utils/request';

export async function addSim(query) {
  return axios({
    url: '/sims',
    method: 'POST',
    data: query,
  });
}

export async function querySims(query) {
  return axios({
    url: '/sims',
    method: 'GET',
    params: query,
  });
}

export async function updateSim(query) {
  return axios({
    url: `/sims/${query.id}`,
    method: 'PUT',
    data: query.data,
  });
}


export async function removeSim(query) {
  return axios({
    url: `/sims/${query.id}`,
    method: 'DELETE',
  });
}


