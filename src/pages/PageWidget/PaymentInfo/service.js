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

/** 保存 */
export async function save(data) {
  const url = `${MDMSCONTEXT}/paymentInfo/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function remove({ id }) {
  const url = `${MDMSCONTEXT}/paymentInfo/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
