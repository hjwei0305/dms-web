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

/** 通过dataCode获取应用订阅清单 */
export async function getAppFromDataCode({ dataCode }) {
  const url = `${MDMSCONTEXT}/appSubscription/getAppFromDataCode?dataCode=${dataCode}`;
  return request({
    url,
    method: 'GET',
  });
}
