/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-03-25 14:52:38
 */
import { utils } from 'suid';
import { constants } from '@/utils';
const { request } = utils;
const { MDMSCONTEXT } = constants;

/** 保存语义译文 */
export async function save(data) {
  const url = `${MDMSCONTEXT}/translation/saveTranslation`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存语义类型 */
export async function saveType(data) {
  const url = `${MDMSCONTEXT}/semantemeType/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除语义类型 */
export async function delType(params) {
  const url = `${MDMSCONTEXT}/semantemeType/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 获取外国语类型 */
export async function getForeignLanguages() {
  const url = `${MDMSCONTEXT}/language/getForeignLanguages`;
  return request({
    url,
    method: 'GET',
  });
}
