import axios from '@/utils/request';

// export async function query() {
//   return axios({
//     url: '/api/users',
//     method: 'GET',
//   });
// }

export async function getAllWell() {
  return axios({
    url: '/wells/all',
    method: 'GET',
  });
}

export async function getWellOpen() {
  return axios({
    url: '/wells/open',
    method: 'GET',
  });
}

export async function getWellLeak() {
  return axios({
    url: '/wells/leak',
    method: 'GET',
  });
}

export async function getWellBattery() {
  return axios({
    url: '/wells/battery',
    method: 'GET',
  });
}


export async function getWarnsCount() {
  return axios({
    url: '/wells/counts',
    method: 'GET',
  });
}

export async function getHistory(query) {
  return axios({
    url: `/data/${query.type}/well/${query.id}`,
    method: 'GET',
    params:{
      offset:query.offset,
      limit:query.limit,
    }
  });
}
// export async function queryCurrent() {
//   return axios({
//     url: '/api/currentUser',
//     method: 'GET',
//   });
// }

// export async function addUser(query) {
//   return axios({
//     url: '/user',
//     method: 'POST',
//     data: {
//       name: query.name,
//       password: query.password,
//       email: query.email,
//       role: query.role,
//     },
//   });
// }

// export async function queryUsers(query) {
//   return axios({
//     url: '/user',
//     method: 'GET',
//     params: query,
//   });
// }

// export async function updateUser(query) {
//   return axios({
//     url: `/user/${query.id}`,
//     method: 'PUT',
//     data: {
//       name: query.name,
//       email: query.email,
//       role: query.role,
//     },
//   });
// }


export async function removeUser(query) {
  return axios({
    url: `/user/${query.id}`,
    method: 'DELETE',
  });
}

export async function resetPassword(query) {
  return axios({
    url: `/user/${query.id}/password`,
    method: 'PUT',
    data: {
      password: query.password,
    },
  });
}
