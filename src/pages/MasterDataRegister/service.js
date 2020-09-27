/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-17 11:23:36
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { MDMSCONTEXT: MockServerPath } = constants;

const contextPath = '/masterDataUiConfig';
// const treeTextPath = '/dataModelType';

/** 注册 */
export async function save(data) {
  const url = `${MockServerPath}/dataDefinition/register`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存模型字段 */
export async function saveModelField(data) {
  const url = `${MockServerPath}${contextPath}/saveModelField`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除模型字段 */
export async function deleteModelFields(data) {
  const url = `${MockServerPath}${contextPath}/deleteModelFields`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 添加审计字段 */
export async function addAuditFields(params) {
  const url = `${MockServerPath}${contextPath}/addAuditFields`;
  return request({
    url,
    params,
    method: 'POST',
  });
}

/** 删除 */
export async function del(params) {
  const url = `${MockServerPath}${contextPath}/unregister/${params.id}`;
  return request({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/** 保存树结点 */
export async function saveTreeNode(data) {
  const url = `${MockServerPath}/dataCategory/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除树结点 */
export async function delTreeNode(params) {
  const url = `${MockServerPath}/dataCategory/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/**
 * 获取所有树结构数据
 */
export async function listAllTree(params = {}) {
  const url = `${MockServerPath}/dataCategory/getTypeTree`;
  return request.get(url, params);
}

/**
 * 根据树结点code获取模型类型
 */
export async function getConfigByTypeId({ categoryId }) {
  const url = `${MockServerPath}/dataDefinition/getRegisterDataByCategoryId?categoryId=${categoryId}`;
  return request.get(url);
}
