import { queryUsers, removeUser, addUser, updateUser } from '@/services/user';

export default {
  namespace: 'ownerList',

  state: {
    data: {
      list: [],
      total: 0,
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
    *add({ payload, callback }, { call, put }) {
      yield call(addUser, payload);
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeUser, payload);
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateUser, payload);
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
