import axios from '@/utils/request';

export async function queryWarnings(query) {
  return axios({
    url: '/warning',
    method: 'GET',
    params: query,
  });
}

export async function bindPrincipal(query) {
  return axios({
    url: `/warning/${query.id}/principal`,
    method: 'POST',
    data: { userId: query.userId },
  });
}

export async function cancelWarning(query) {
  return axios({
    url: `/warning/${query.id}/cancel`,
    method: 'POST',
  });
}

export async function queryWarningCounts() {
  return axios({
    url: `/warning/unhandle`,
    method: 'GET',
  });
}


