import axios from '@/utils/request';

// export async function query() {
//   return axios({
//     url: '/api/users',
//     method: 'GET',
//   });
// }

export async function queryCurrent() {
  return axios({
    url: '/user/me',
    method: 'GET',
  });
}

export async function addUser(query) {
  return axios({
    url: '/user',
    method: 'POST',
    data: query,
  });
}

export async function queryUsers(query) {
  return axios({
    url: '/user',
    method: 'GET',
    params: query,
  });
}

export async function updateMe(query) {
  return axios({
    url: `/user/${query.id}/me`,
    method: 'PUT',
    data: query.data,
  });
}


export async function removeUser(query) {
  return axios({
    url: `/user/${query.id}`,
    method: 'DELETE',
  });
}

export async function resetPassword(query) {
  return axios({
    url: `/user/${query.id}/password/me`,
    method: 'PUT',
    data: query.data,
  });
}
