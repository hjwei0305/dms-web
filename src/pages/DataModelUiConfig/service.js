/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-16 11:35:20
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { MDMSCONTEXT: MockServerPath } = constants;

const contextPath = '/masterDataUiConfig';

/** 保存父表格数据 */
export async function saveParent(data) {
  const url = `${MockServerPath}${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存字表行数据 */
export async function saveChild(data) {
  const url = `${MockServerPath}${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除父亲表格数据 */
export async function delParentRow(params) {
  const url = `${MockServerPath}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 删除字表格数据 */
export async function delChildRow(params) {
  const url = `${MockServerPath}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 获取主数据字段 */
export async function getPropertiesByCode({ code }) {
  const url = `${MockServerPath}${contextPath}/getPropertiesByCode?code=${code}&random=${Math.random()}`;
  return request({
    url,
    method: 'GET',
  });
}

/** 根据模型code获取ui配置 */
export async function getConfigByCode({ code }) {
  const url = `${MockServerPath}${contextPath}/getConfigByCode?code=${code}`;
  return request({
    url,
    method: 'GET',
  });
}

/** 保存模型ui配置 */
export async function saveModelUiConfig(data) {
  const url = `${MockServerPath}${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
