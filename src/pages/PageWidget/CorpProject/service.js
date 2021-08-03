/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2021-08-03 14:33:21
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { MDMSCONTEXT } = constants;

/** 保存数据 */
export async function saveChild(data) {
  const url = `${MDMSCONTEXT}/corporationProject/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除字表格数据 */
export async function delChildRow({ id }) {
  const url = `${MDMSCONTEXT}/corporationProject/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
