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
export async function saveParent(data) {
  const url = `${MDMSCONTEXT}/ledgerAccount/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存数据 */
export async function saveChild(data) {
  const url = `${MDMSCONTEXT}/wbsProject/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除父亲表格数据 */
export async function delParentRow({ id }) {
  const url = `${MDMSCONTEXT}/wbsProject/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 删除字表格数据 */
export async function delChildRow({ id }) {
  const url = `${MDMSCONTEXT}/personnel/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
