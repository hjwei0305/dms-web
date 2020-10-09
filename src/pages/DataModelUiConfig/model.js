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
    vFilterFormConfig: false,
    modelUiConfig: null,
    modelUiIds: {},
  },
  effects: {
    *updatePageState({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });

      return payload;
    },
    *getConfigById({ payload }, { call, put }) {
      const result = yield call(getConfigById, payload);
      const { success, data, message: msg } = result || {};
      const modelUiConfig = {};
      const modelUiIds = {};
      (data || []).forEach(it => {
        const { configType, id, configData } = it;
        modelUiIds[configType] = id;
        modelUiConfig[configType] = configData;
      });
      message.destroy();
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            modelUiConfig,
            modelUiIds,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
    *saveModelUiConfig({ payload }, { call, put, select }) {
      const modelUiIds = yield select(state => state.dataModelUiConfig.modelUiIds);
      const { configType: cfgType } = payload.data;
      const result = yield call(saveModelUiConfig, {
        ...payload.data,
        ...{ id: modelUiIds[cfgType] },
      });
      const { message: msg, success, data } = result || {};
      const { id, configType } = data;
      if (success) {
        message.success(msg);
        yield put({
          type: 'updateState',
          payload: {
            modelUiConfig: payload.modelUiConfig,
            modelUiIds: { ...modelUiIds, ...{ [configType]: id } },
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
  },
});
