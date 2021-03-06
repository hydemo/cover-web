import { queryOwners, removeOwner, addOwner, updateOwner } from '@/services/owner';

export default {
  namespace: 'ownerList',

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
      const response = yield call(queryOwners, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield call(addOwner, payload);
      const response = yield call(queryOwners, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeOwner, payload);
      const response = yield call(queryOwners, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateOwner, payload);
      const response = yield call(queryOwners, payload);
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