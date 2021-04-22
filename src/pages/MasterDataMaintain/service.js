/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-17 15:41:02
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { MDMSCONTEXT } = constants;

/** 保存父表格数据 */
export async function saveParent(data, contextPath) {
  const url = `${MDMSCONTEXT}/${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存数据 */
export async function saveChild(params) {
  const { data, contextPath } = params;
  const url = `${MDMSCONTEXT}/${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除父亲表格数据 */
export async function delParentRow(params) {
  const { id, contextPath } = params;
  const url = `${MDMSCONTEXT}/${contextPath}/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 删除字表格数据 */
export async function delChildRow(params) {
  const { id, contextPath } = params;
  const url = `${MDMSCONTEXT}/${contextPath}/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 根据模型id获取ui配置 */
export async function getConfigById({ id }) {
  const url = `${MDMSCONTEXT}/dataDefinition/getConfigById?id=${id}`;
  return request({
    url,
    method: 'GET',
  });
}

/** 获取模型的导入模版数据 */
export async function importTemplateData({ contextPath }) {
  const url = `${MDMSCONTEXT}/excel/${contextPath}/importTemplateData`;
  return request({
    url,
    method: 'GET',
  });
}

/** 根据条件导出数据 */
export async function exportData({ data, contextPath }) {
  const url = `${MDMSCONTEXT}/excel/${contextPath}/exportData`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 检查导入和导出的状态 */
export async function imExStatus({ contextPath }) {
  const url = `${MDMSCONTEXT}/excel/${contextPath}/imExStatus`;
  return request({
    url,
    method: 'GET',
  });
}

/** 获取模型的导入模版数据 */
export async function importDataExcel({ data, contextPath }) {
  const url = `${MDMSCONTEXT}/excel/${contextPath}/importDataExcel`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 通过dataCode获取应用订阅清单 */
export async function getAppFromDataCode({ dataCode }) {
  const url = `${MDMSCONTEXT}/appSubscription/getAppFromDataCode?dataCode=${dataCode}`;
  return request({
    url,
    method: 'GET',
  });
}
