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

const contextPath = '/dataDefinition';

/** 获取主数据字段 */
export async function getPropertiesByCode({ code }) {
  const url = `${MockServerPath}${contextPath}/getPropertiesByCode?code=${code}&random=${Math.random()}`;
  return request({
    url,
    method: 'GET',
  });
}

/** 根据模型id获取ui配置 */
export async function getConfigById({ id }) {
  const url = `${MockServerPath}${contextPath}/getConfigById?id=${id}`;
  return request({
    url,
    method: 'GET',
  });
}

/** 保存模型ui配置 */
export async function saveModelUiConfig(data) {
  const url = `${MockServerPath}${contextPath}/saveConfig`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
