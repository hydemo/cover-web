import { getUnnarmal,getAllWell, getWellOpen, getWellLeak, getWellBattery, getWarnsCount, getHistory } from '@/services/monitor';

export default {
  namespace: 'monitor',

  state: {
    counts: {}
  },

  effects: {
    *getUnnarmal({ callBack }, { call }) {
      const response = yield call(getUnnarmal);
      if (callBack) callBack(response);
    },

    *getAllWell({ callBack }, { call }) {
      const response = yield call(getAllWell);
      if (callBack) callBack(response);
    },

    *getWellOpen({ callBack }, { call }) {
      const response = yield call(getWellOpen);
      if (callBack) callBack(response);
    },

    *getWellLeak({ callBack }, { call }) {
      const response = yield call(getWellLeak);
      if (callBack) callBack(response);
    },
    *getWellBattery({ callBack }, { call }) {
      const response = yield call(getWellBattery);
      if (callBack) callBack(response);
    },
    *getWarnsCount({ callBack }, { call, put }) {
      const response = yield call(getWarnsCount);
      yield put({
        type: 'setCounts',
        payload: response,
      });
      if (callBack) callBack(response);
    },
    *getHistory({ payload, callBack }, { call }) {
      const response = yield call(getHistory, payload);
      if (callBack) callBack(response);
    },
  },

  reducers: {
    setCounts(state, action) {
      return {
        ...state,
        counts: action.payload,
      };
    },
  },
};
