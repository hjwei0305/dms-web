/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-10 09:24:07
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { MDMSCONTEXT: MockServerPath } = constants;

const contextPath = '/dataModel';

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

/** 获取模型字段 */
export async function getDataModelFields({ modelId }) {
  const url = `${MockServerPath}${contextPath}/getDataModelFields?modelId=${modelId}`;
  return request({
    url,
    method: 'GET',
  });
}

/** 根据模型id获取ui配置 */
export async function getByDataModalId({ modelId }) {
  const url = `http://rddgit.changhong.com:7300/mock/5f1e7e322fb72cd97c23e239/dataManager/modalUiConfig/getByDataModalId?modelId=${modelId}`;
  return request({
    url,
    method: 'GET',
  });
}

/** 保存模型ui配置 */
export async function saveModelUiConfig(data) {
  // const url = `${MockServerPath}${contextPath}/save`;
  const url = `http://rddgit.changhong.com:7300/mock/5f1e7e322fb72cd97c23e239/dataManager/modalUiConfig/saveModelUiConfig`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
