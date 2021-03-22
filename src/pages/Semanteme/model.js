/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-03-25 14:08:40
 */
import { delType, saveType, save, getForeignLanguages } from './service';
import { message } from 'antd';
import { utils } from 'suid';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'semanteme',

  state: {
    list: [],
    rowData: null,
    modalVisible: false,
    treeData: [],
    currType: null,
    languageTypes: [],
    currLanguageId: null,
    showModal: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/semanteme', location.pathname)) {
          dispatch({
            type: 'getForeignLanguages',
          });
        }
      });
    },
  },
  effects: {
    *updateCurrNode({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });

      return payload;
    },
    *save({ payload }, { call }) {
      const result = yield call(save, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success('保存成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *saveType({ payload }, { call }) {
      const result = yield call(saveType, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success('保存成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *delType({ payload }, { call }) {
      const result = yield call(delType, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success('删除成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *getForeignLanguages(_, { call, put }) {
      const result = yield call(getForeignLanguages);
      const { message: msg, success, data } = result || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            languageTypes: data,
            currLanguageId: data && data[0].id,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
  },
});
