import { queryWells, removeWell, addWell, updateWell, bindOwner, bindDevice } from '@/services/well';

export default {
  namespace: 'wellList',

  state: {
    record: {},
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
      const response = yield call(queryWells, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call }) {
      yield call(addWell, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeWell, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call }) {
      yield call(updateWell, payload);
      if (callback) callback();
    },
    *owner({ payload, callback }, { call }) {
      yield call(bindOwner, payload);
      if (callback) callback();
    },
    *device({ payload, callback }, { call }) {
      yield call(bindDevice, payload);
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
    }
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