/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-17 15:40:32
 */
import { message } from 'antd';
import { utils } from 'suid';
import {
  delParentRow,
  saveParent,
  saveChild,
  delChildRow,
  getConfigById,
  importTemplateData,
  importDataExcel,
  exportData,
  imExStatus,
} from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

// semanteme

export default modelExtend(model, {
  namespace: 'masterDataMaintain',

  state: {
    currPRowData: null,
    currCRowData: null,
    isAddP: false,
    pVisible: false,
    cVisible: false,
    modelUiConfig: null,
    importXlsData: null,
    importTemplateTitles: null,
  },
  effects: {
    *updatePageState({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });

      return payload;
    },
    *saveChild({ payload }, { call }) {
      const result = yield call(saveChild, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *getConfigById({ payload }, { call, put }) {
      const result = yield call(getConfigById, payload);
      const { success, data, message: msg } = result || {};
      const modelUiConfig = {};
      (data || []).forEach(it => {
        const { configType, configData } = it;
        modelUiConfig[configType] = configData;
      });

      message.destroy();
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            modelUiConfig,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
    *saveParent({ payload }, { call }) {
      const result = yield call(saveParent, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *delPRow({ payload }, { call }) {
      const result = yield call(delParentRow, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *delCRow({ payload }, { call }) {
      const result = yield call(delChildRow, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *importTemplateData({ payload }, { call, put }) {
      const result = yield call(importTemplateData, payload);
      const { message: msg, success, data } = result || {};
      message.destroy();
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            importTemplateTitles: data.title,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
    *importDataExcel({ payload }, { call }) {
      const result = yield call(importDataExcel, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *exportData({ payload }, { call }) {
      const result = yield call(exportData, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *imExStatus({ payload }, { call }) {
      const result = yield call(imExStatus, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (!success) {
        message.error(msg);
      }

      return result;
    },
  },
});
