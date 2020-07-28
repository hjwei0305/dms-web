/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-07-27 15:23:35
*/
import { utils } from 'suid';

const { request } = utils;

const MockServerPath = 'http://rddgit.changhong.com:7300/mock/5e02d29836608e42d52b1d81/template-service';
const contextPath = '/simple-master';

/** 保存 */
export async function save (data) {
  const url = `${MockServerPath}${contextPath}/save`;

  return request.post(url, data);
}

/** 删除 */
export async function del (params) {
  const url = `${MockServerPath}${contextPath}/delete/${params.id}`
  return request.delete(url);
}
