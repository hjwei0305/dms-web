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
  const url = `${MDMSCONTEXT}/corpPaymentBankAccount/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 设置默认，同一公司下同一币种仅一条默认，替换原有默认数据 */
export async function setAsDefault({ id }) {
  const url = `${MDMSCONTEXT}/corpPaymentBankAccount/setAsDefault/${id}`;
  return request({
    url,
    method: 'POST',
    data: {},
  });
}

/** 删除字表格数据 */
export async function delChildRow({ id }) {
  const url = `${MDMSCONTEXT}/corpPaymentBankAccount/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
