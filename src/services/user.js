import axios from '@/utils/request';
import md5 from 'md5'

export async function queryCurrent() {
  return axios({
    url: '/user/me',
    method: 'GET',
  });
}

export async function addUser(query) {
  const password = md5(query.password)
  return axios({
    url: '/user',
    method: 'POST',
    data: { ...query, password },
  });
}

export async function updateUser(query) {
  return axios({
    url: `/user/${query.id}`,
    method: 'PUT',
    data: query.data,
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
  const password = md5(query.password)
  return axios({
    url: `/user/${query.id}/password`,
    method: 'PUT',
    data: { password },
  });
}

export async function resetPasswordMe(query) {
  const newPassword = md5(query.data.newPassword)
  const oldPassword = md5(query.data.oldPassword)
  return axios({
    url: `/user/${query.id}/password/me`,
    method: 'PUT',
    data: { ...query.data, newPassword, oldPassword },
  });
}
