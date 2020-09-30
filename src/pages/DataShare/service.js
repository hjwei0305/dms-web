/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-17 15:41:02
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { MDMSCONTEXT: MockServerPath } = constants;

/** 保存父表格数据 */
export async function saveParent(data, contextPath) {
  const url = `${MockServerPath}${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存数据 */
export async function saveChild(params) {
  const { data, contextPath } = params;
  const url = `${MockServerPath}${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除父亲表格数据 */
export async function delParentRow(params) {
  const { id, contextPath } = params;
  const url = `${MockServerPath}${contextPath}/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 删除字表格数据 */
export async function delChildRow(params) {
  const { id, contextPath } = params;
  const url = `${MockServerPath}${contextPath}/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 获取主数据字段 */
export async function getPropertiesByCode({ code }) {
  const url = `${MockServerPath}/dataDefinition/getPropertiesByCode?code=${code}&random=${Math.random()}`;
  return request({
    url,
    method: 'GET',
  });
}
