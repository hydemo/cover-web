import { querySims, removeSim, addSim, updateSim } from '@/services/sim';

export default {
  namespace: 'simList',

  state: {
    data: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        pageSize: 10,
      }
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySims, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield call(addSim, payload);
      const response = yield call(querySims, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeSim, payload);
      const response = yield call(querySims, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateSim, payload);
      const response = yield call(querySims, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *setPagination({ payload, callback }, { put }) {
      yield put({
        type: 'pagination',
        payload,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      const { data: { pagination } } = state
      pagination.total = action.payload.total
      const data = {
        list: action.payload.list,
        pagination,
      }
      return {
        ...state,
        data,
      };
    },
    pagination(state, action) {
      const { data: { pagination } } = state;
      const data = {
        list: action.payload.list,
        pagination: {
          ...pagination,
          ...action.payload,
        },
      }
      return {
        ...state,
        data,
      };
    }
  },
};
