import { queryDevices, removeDevice, addDevice, updateDevice, bindSim } from '@/services/device';

export default {
  namespace: 'deviceList',

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
      const response = yield call(queryDevices, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield call(addDevice, payload);
      const response = yield call(queryDevices);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeDevice, payload);
      const response = yield call(queryDevices);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateDevice, payload);
      const response = yield call(queryDevices);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *sim({ payload, callback }, { call }) {
      yield call(bindSim, payload);
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

