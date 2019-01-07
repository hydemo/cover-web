import { queryWarnings, bindPrincipal, cancelWarning } from '@/services/warning';

export default {
  namespace: 'warning',

  state: {
    record: {},
    data: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        pageSize: 10,
        search: {}
      }
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWarnings, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *bind({ payload, callback }, { call }) {
      yield call(bindPrincipal, payload);
      if (callback) callback();
    },

    *cancel({ payload, callback }, { call }) {
      yield call(cancelWarning, payload);
      if (callback) callback();
    },
    *setPagination({ payload, callback }, { put }) {
      yield put({
        type: 'pagination',
        payload,
      });
      if (callback) callback();
    },
    *setRecord({ payload, callback }, { put }) {
      yield put({
        type: 'record',
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
    },
    record(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    }
  },
};