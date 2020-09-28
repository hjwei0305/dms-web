/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-18 10:04:37
 */
import { message } from 'antd';
import { utils } from 'suid';
import { getConfigById, saveModelUiConfig } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

// semanteme

export default modelExtend(model, {
  namespace: 'dataModelUiConfig',

  state: {
    currPRowData: null,
    currCRowData: null,
    isAddP: false,
    pVisible: false,
    cVisible: false,
    vTableUiConfig: false,
    vFormUiConfig: false,
    vTreeUiConfig: false,
    vExportUiConfig: false,
    vImportUiConfig: false,
    modelUiConfig: null,
  },
  effects: {
    *updatePageState({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });

      return payload;
    },
    *getConfigById({ payload }, { call, put, select }) {
      const currPRowData = yield select(state => state.dataModelUiConfig.currPRowData);
      const result = yield call(getConfigById, payload);
      const { success, data: modelUiConfig } = result || {};

      message.destroy();
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            modelUiConfig,
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            modelUiConfig: currPRowData,
          },
        });
        // message.error(msg);
      }

      return result;
    },
    *saveModelUiConfig({ payload }, { call, put }) {
      const result = yield call(saveModelUiConfig, payload.data);
      const { message: msg, success } = result || {};
      if (success) {
        message.success(msg);
        yield put({
          type: 'updateState',
          payload: {
            modelUiConfig: payload.modelUiConfig,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
  },
});
