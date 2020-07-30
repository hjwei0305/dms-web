/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-07-30 16:52:35
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { MDMSCONTEXT: MockServerPath } = constants;

const contextPath = 'dataModelType';

/** 获取树 */
export async function getTree() {
  const url = `${MockServerPath}${contextPath}/getModelTypeTree`;
  return request({
    url,
    method: 'GET',
  });
}

/** 保存 */
export async function save(data) {
  const url = `${MockServerPath}${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${MockServerPath}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
