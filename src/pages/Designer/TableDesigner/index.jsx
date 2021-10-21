import React from 'react';
import { constants } from '@/utils';
import { Ctx } from './context';
import { useSet } from './hooks';

import TableDesigner from './TableDesigner';

const { CURR_CONTEXT_PATH } = constants;

const CmpMap = {
  ExtInput: 'Input',
  ExtComboGrid: 'TableSelect',
  ExtInputNumber: 'InputNumber',
  ExtSelect: 'Select',
};

const Designer = ({ parentData, uiConfig = {} }) => {
  const { code } = parentData;
  const { UI = JSON.stringify({}) } = uiConfig;
  const uiObj = JSON.parse(UI);
  const { showConfig = {}, formConfig = {} } = uiObj;
  const addFormItems = [];
  const editFormItems = [];
  showConfig &&
    showConfig.columns.forEach(it => {
      Object.assign(it, {
        originalName: it.title,
        emptyPlaceholder: '-',
      });
    });
  if (formConfig) {
    const { formItems = [] } = formConfig;
    formItems.forEach(([orignField, addField, editField]) => {
      let addShowField;
      let editShowField;
      if (addField['ui:widget'] === 'ExtComboGrid') {
        addField['ExtComboGrid'].cfg.forEach(({ code, isShowField }) => {
          if (isShowField) {
            addShowField = code;
          }
        });
      }
      if (editField['ui:widget'] === 'ExtComboGrid') {
        editField['ExtComboGrid'].cfg.forEach(({ code, isShowField }) => {
          if (isShowField) {
            editShowField = code;
          }
        });
      }
      addFormItems.push({
        type: CmpMap[addField['ui:widget']] || 'Input',
        label: addField.title,
        name: orignField.code,
        hidden: !!addField['ui:hidden'],
        originalName: orignField.name,
        showField: addShowField,
        columns:
          addField['ui:widget'] === 'ExtComboGrid' &&
          addField['ExtComboGrid'].cfg
            .map(({ code, name, hidden }) => ({ dataIndex: code, title: name, hidden }))
            .filter(({ hidden }) => !hidden),
        store: addField['ui:widget'] === 'ExtComboGrid' && {
          type: 'POST',
          url: `${CURR_CONTEXT_PATH}${addField['ExtComboGrid'].dataModelCode}/findByPage`,
        },
        submitFields:
          addField['ui:widget'] === 'ExtComboGrid'
            ? addField['ExtComboGrid'].cfg
                .map(({ sumitField }) => sumitField)
                .filter(sumitField => !!sumitField)
            : [],
        originFields:
          addField['ui:widget'] === 'ExtComboGrid'
            ? addField['ExtComboGrid'].cfg
                .filter(({ sumitField }) => !sumitField)
                .map(({ code }) => code)
            : [],
        options: addField['ui:widget'] === 'ExtSelect' ? addField['ExtSelect'].options : [],
        ...addField,
      });
      editFormItems.push({
        type: CmpMap[editField['ui:widget']] || 'Input',
        label: editField.title,
        name: orignField.code,
        showField: editShowField,
        hidden: !!editField['ui:hidden'],
        originalName: orignField.name,
        columns:
          editField['ui:widget'] === 'ExtComboGrid' &&
          editField['ExtComboGrid'].cfg
            .map(({ code, name, hidden }) => ({ dataIndex: code, title: name, hidden }))
            .filter(({ hidden }) => !hidden),
        store: editField['ui:widget'] === 'ExtComboGrid' && {
          type: 'POST',
          url: `${CURR_CONTEXT_PATH}${addField['ExtComboGrid'].dataModelCode}/findByPage`,
        },
        submitFields:
          editField['ui:widget'] === 'ExtComboGrid'
            ? editField['ExtComboGrid'].cfg
                .map(({ sumitField }) => sumitField)
                .filter(sumitField => !!sumitField)
            : [],
        originFields:
          editField['ui:widget'] === 'ExtComboGrid'
            ? editField['ExtComboGrid'].cfg
                .filter(({ sumitField }) => !sumitField)
                .map(({ code }) => code)
            : [],
        options: editField['ui:widget'] === 'ExtSelect' ? editField['ExtSelect'].options : [],
        ...editField,
      });
    });
  }

  const globalState = useSet({
    _parentData: parentData,
    searchPlaceHolder: '请输入关键字查询',
    columns: [
      // {
      //   dataIndex: 'code',
      //   originalName: '税码',
      //   title: '税码',
      //   width: 120,
      //   align: 'left',
      //   emptyPlaceholder: '-',
      // },
      // {
      //   dataIndex: 'name',
      //   originalName: '名称',
      //   title: '名称',
      //   width: 120,
      //   align: 'left',
      //   emptyPlaceholder: '-',
      // },
      // {
      //   dataIndex: 'taxRate',
      //   originalName: '税率',
      //   title: '税率',
      //   width: 120,
      //   align: 'left',
      //   emptyPlaceholder: '-',
      // },
    ],
    remotePaging: true,
    showRefresh: true,
    showSearch: false,
    add: {
      method: 'POST',
      layout: 'horizontal',
      colSpan: 24,
      url: `/api-gateway/dms/${code}/save`,
      formItems: addFormItems || [],
      // formItems: [
      //   {
      //     type: 'Select',
      //     name: 'taxCategory',
      //     originalName: '税分类',
      //     label: '税分类',
      //     preFields: [],
      //     disabled: false,
      //     hidden: false,
      //     options: '[{"label":"销项税", "value": "OUTPUT"}, {"label": "进项税", "value":"INPUT"}]',
      //   },
      //   {
      //     type: 'Input',
      //     name: 'code',
      //     originalName: '税码',
      //     label: '税码',
      //     preFields: [],
      //     uiConfig: {},
      //   },
      //   {
      //     type: 'Input',
      //     name: 'name',
      //     originalName: '名称',
      //     label: '名称',
      //     preFields: [],
      //     uiConfig: {},
      //   },
      //   {
      //     type: 'Input',
      //     name: 'ledgerAccountCode',
      //     originalName: '总账科目代码',
      //     label: '总账科目代码',
      //     preFields: [],
      //     hidden: true,
      //     uiConfig: {},
      //   },
      //   {
      //     type: 'ListSelect',
      //     name: 'ledgerAccountName',
      //     originalName: '总账科目名称',
      //     label: '总账科目',
      //     preFields: [],
      //     store: {
      //       type: 'POST',
      //       url: '/api-gateway/dms/ledgerAccount/findByPage',
      //       autoLoad: false,
      //     },
      //     showField: 'name',
      //     originFields: ['code'],
      //     submitFields: ['ledgerAccountCode'],
      //   },
      //   {
      //     type: 'InputNumber',
      //     name: 'rank',
      //     originalName: '排序',
      //     label: '排序',
      //     preFields: [],
      //     uiConfig: {},
      //   },
      // ],
    },
    edit: {
      method: 'POST',
      layout: 'horizontal',
      colSpan: 24,
      url: `/api-gateway/dms/${code}/save`,
      formItems: editFormItems || [],
    },
    optCol: {
      title: '操作',
      width: 90,
      align: 'center',
      fixed: true,
    },
    del: {
      method: 'DELETE',
      url: `/api-gateway/dms/${code}/delete`,
    },
    store: {
      type: 'POST',
      url: `/api-gateway/dms/${code}/findByPage`,
    },
    // "searchProperties": ["travelSupplierCityCode","travelSupplierCityName"],
    // "searchPlaceHolder": "请输入城市代码、城市名称",
    // "showSearch": true,
    // "optCol": {
    //   "title": "操作",
    //   "width": 90,
    //   "align": "center",
    //   "fixed": true
    // },
    // "add": {
    //     "method": "POST",
    //     "formItems": [
    //         {
    //             "type": "TreeSelect",
    //             "name": "regionName",
    //             "label": "行政区域",
    //             "preFields": [],
    //             "store": {
    //                 "type": "GET",
    //                 "url": "/api-gateway/bts-v6/otherModuleData/getRegionMultipleRoots",
    //                 "autoLoad": false
    //             },
    //             "showField": "name",
    //             "originFields": ["id", "code", "namePath"],
    //             "submitFields": ["regionId", "regionCode","regionNamePath"]
    //         },
    //         {
    //             "type": "ListSelect",
    //             "name": "travelSupplierName",
    //             "label": "商旅供应商",
    //             "preFields": [],
    //             "store": {
    //                 "type": "GET",
    //                 "url": "/api-gateway/bts-v6/travelSupplier/findAll",
    //                 "autoLoad": false
    //             },
    //             "showField": "name",
    //             "originFields": ["id"],
    //             "submitFields": ["travelSupplierId"]
    //         },
    //         {
    //             "type": "Select",
    //             "name": "productType",
    //             "label": "产品类型",
    //             "preFields": [],
    //             "options": "[{\"label\":\"适用所有\",\"value\":\"ALL\"}, {\"label\":\"用车\",\"value\":\"CAR\"}, {\"label\":\"机票\",\"value\":\"FLIGHT\"}, {\"label\":\"住宿\",\"value\":\"HOTEL\"},{\"label\":\"火车\",\"value\":\"TRAIN\"}]"
    //         },
    //         {
    //             "type": "Input",
    //             "name": "travelSupplierCityId",
    //             "label": "城市标识",
    //             "preFields": [],
    //             "uiConfig": {}
    //         },
    //         {
    //             "type": "Input",
    //             "name": "travelSupplierCityName",
    //             "label": "城市名称",
    //             "preFields": [],
    //             "uiConfig": {}
    //         }
    //     ],
    //     "layout": "horizontal",
    //     "colSpan": 24,
    //     "url": "/api-gateway/bts-v6/travelCity/save"
    // },
    // "edit": {
    //     "method": "POST",
    //     "formItems": [
    //         {
    //             "type": "TreeSelect",
    //             "name": "regionName",
    //             "label": "行政区域",
    //             "preFields": [],
    //             "store": {
    //                 "type": "GET",
    //                 "url": "/api-gateway/bts-v6/otherModuleData/getRegionMultipleRoots",
    //                 "autoLoad": false
    //             },
    //             "showField": "name",
    //             "originFields": ["id", "code", "namePath"],
    //             "submitFields": ["regionId", "regionCode","regionNamePath"]
    //         },
    //         {
    //             "type": "ListSelect",
    //             "name": "travelSupplierName",
    //             "label": "商旅供应商",
    //             "preFields": [],
    //             "store": {
    //                 "type": "GET",
    //                 "url": "/api-gateway/bts-v6/travelSupplier/findAll",
    //                 "autoLoad": false
    //             },
    //             "showField": "name",
    //             "defaultField": "travelSupplier.name",
    //             "originFields": ["id"],
    //             "submitFields": ["travelSupplierId"]
    //         },
    //         {
    //             "type": "Select",
    //             "name": "productType",
    //             "label": "产品类型",
    //             "preFields": [],
    //             "options": "[{\"label\":\"适用所有\",\"value\":\"ALL\"}, {\"label\":\"用车\",\"value\":\"CAR\"}, {\"label\":\"机票\",\"value\":\"FLIGHT\"}, {\"label\":\"住宿\",\"value\":\"HOTEL\"},{\"label\":\"火车\",\"value\":\"TRAIN\"}]"
    //         },
    //         {
    //             "type": "Input",
    //             "name": "travelSupplierCityId",
    //             "label": "城市标识",
    //             "preFields": [],
    //             "uiConfig": {}
    //         },
    //         {
    //             "type": "Input",
    //             "name": "travelSupplierCityName",
    //             "label": "城市名称",
    //             "preFields": [],
    //             "uiConfig": {}
    //         }
    //     ],
    //     "layout": "horizontal",
    //     "colSpan": 24,
    //     "url": "/api-gateway/bts-v6/travelCity/save"
    // },
    // "columns": [
    //     {
    //         "dataIndex": "regionName",
    //         "title": "行政区域",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplier.name",
    //         "title": "商旅供应商",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "productType",
    //         "title": "产品类型",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierCityId",
    //         "title": "城市标识",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierCityCode",
    //         "title": "城市代码",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierCityName",
    //         "title": "城市名称",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierCityNameEn",
    //         "title": "城市英文名称",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierProvinceCode",
    //         "title": "省区代码",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierProvinceName",
    //         "title": "省区名称",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierProvinceNameEn",
    //         "title": "省区英文名称",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierCountryCode",
    //         "title": "国家代码",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierCountryName",
    //         "title": "国家名称",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     },
    //     {
    //         "dataIndex": "travelSupplierCountryNameEn",
    //         "title": "国家英文名称",
    //         "width": 120,
    //         "align": "left",
    //         "emptyPlaceholder": "-"
    //     }
    // ],
    // "del": {
    //     "method": "DELETE",
    //     "url": "/api-gateway/bts-v6/travelCity/delete"
    // },
    // "store": {
    //     "type": "POST",
    //     "url": "/api-gateway/bts-v6/travelCity/findByPage"
    // },
    // "remotePaging": true,
    // "showRefresh": true
    ...showConfig,
    ...uiObj,
  });

  return (
    <Ctx.Provider value={globalState}>
      <TableDesigner />
    </Ctx.Provider>
  );
};

export default Designer;
