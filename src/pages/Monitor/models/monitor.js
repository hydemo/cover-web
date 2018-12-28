import { getAllWell, getWellOpen,getWellLeak} from '@/services/monitor';

export default {
  namespace: 'monitor',

  state: {
    // tags: [],
  },

  effects: {
    *getAllWell({callBack}, { call }) {
      const response = yield call(getAllWell);
      // console.log(response,'response')
    if(callBack) callBack(response);
    },

    *getWellOpen({callBack}, { call }) {
      const response = yield call(getWellOpen);
    if(callBack) callBack(response);
    },

    *getWellLeak({callBack}, { call }) {
      const response = yield call(getWellLeak);
    if(callBack) callBack(response);
    },
  },

  reducers: {
    // saveTags(state, action) {
    //   return {
    //     ...state,
    //     tags: action.payload,
    //   };
    // },
  },
};
