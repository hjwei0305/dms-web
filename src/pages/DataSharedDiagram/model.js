/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-17 15:40:32
 */
import { message } from 'antd';
import { utils } from 'suid';
import { getAppFromDataCode } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'dataShareDiagram',

  state: {
    currSelectedItem: null,
    subList: null,
  },
  effects: {
    *updatePageState({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });

      return payload;
    },
    *onItemSelected({ payload }, { call, put }) {
      const result = yield call(getAppFromDataCode, { dataCode: payload.currSelectedItem.code });
      const { success, message: msg, data } = result || {};
      message.destroy();
      if (!success) {
        message.error(msg);
      }
      yield put({
        type: 'updateState',
        payload: {
          ...payload,
          subList: data,
        },
      });

      return result;
    },
  },
});
