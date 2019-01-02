import { query as queryUsers, queryCurrent, updateCurrent } from '@/services/user';
import { baseURL } from '@/utils/config'
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

const role = ['superAdmin', 'Admin', 'Operation', 'User']
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: { response, currentAuthority: role[response.data.role] },
      });
    },
    *fetchCurrent({ callback }, { call, put }) {
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload: { response, currentAuthority: role[response.data.role] },
        });
        reloadAuthorized();
        if (callback) callback()
      }
    },
    *updateCurrent({ callback, payload }, { call, put }) {
      const response = yield call(updateCurrent, payload);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload,
        });
        reloadAuthorized();
        if (callback) callback()
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, { payload }) {
      setAuthority(payload.currentAuthority);
      const { avatar } = payload.response.data
      const { data } = payload.response
      if (avatar) {
        data.avatar = `${baseURL}/${avatar}`
      }
      console.log(data, 'data')
      return {
        ...state,
        currentUser: data || {},
      };
    },
    changeNotifyCount(state, { payload }) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: payload.totalCount,
          unreadCount: payload.unreadCount,
        },
      };
    },
  },
};
