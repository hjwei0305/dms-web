/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-03-23 09:23:41
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { SERVER_PATH } = constants;
const { request } = utils;

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-commons-data/language/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-commons-data/language/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
