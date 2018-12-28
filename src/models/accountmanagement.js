import { queryUsers, removeUser, addUser, updateUser, resetPassword } from '@/services/user';

export default {
  namespace: 'accountmanagement',

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
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call }) {
      yield call(addUser, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeUser, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call }) {
      yield call(updateUser, payload);
      if (callback) callback();
    },
    *password({ payload, callback }, { call }) {
      yield call(resetPassword, payload);
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
      const { pagination } = state;
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

