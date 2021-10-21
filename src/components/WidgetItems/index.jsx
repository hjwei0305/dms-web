import withAsyncCmp from '../withAsyncCmp';
import InputNumberPropsForm from './InputNumber/PropsForm';
import InputPropsForm from './Input/PropsForm';
import ScopeMonthPropsForm from './ScopeMonth/PropsForm';
import ScopeDatePropsForm from './ScopeDate/PropsForm';
import SelectPropsForm from './Select/PropsForm';
import MoneyInputPropsForm from './MoneyInput/PropsForm';
import TreeSelectPropsForm from './TreeSelect/PropsForm';
import ListSelectPropsForm from './ListSelect/PropsForm';
import TableSelectPropsForm from './TableSelect/PropsForm';

export default {
  Input: {
    desc: '字符输入框',
    Cmp: withAsyncCmp(() => import(/* webpackChunkName: "WidgetItem_Input" */ './Input')),
    PropsForm: InputPropsForm,
  },
  InputNumber: {
    desc: '数字输入框',
    Cmp: withAsyncCmp(() =>
      import(/* webpackChunkName: "WidgetItem_InputNumber" */ './InputNumber'),
    ),
    PropsForm: InputNumberPropsForm,
  },
  MoneyInput: {
    desc: '金额输入框',
    Cmp: withAsyncCmp(() => import(/* webpackChunkName: "WidgetItem_MoneyInput" */ './MoneyInput')),
    PropsForm: MoneyInputPropsForm,
  },
  Select: {
    desc: '下拉框',
    Cmp: withAsyncCmp(() => import(/* webpackChunkName: "WidgetItem_Select" */ './Select')),
    PropsForm: SelectPropsForm,
  },
  ScopeMonth: {
    desc: '年月区间',
    Cmp: withAsyncCmp(() => import(/* webpackChunkName: "WidgetItem_ScopeMonth" */ './ScopeMonth')),
    PropsForm: ScopeMonthPropsForm,
  },
  ScopeDate: {
    desc: '日期区间',
    Cmp: withAsyncCmp(() => import(/* webpackChunkName: "WidgetItem_ScopeDate" */ './ScopeDate')),
    PropsForm: ScopeDatePropsForm,
  },
  ListSelect: {
    desc: '列表选择',
    Cmp: withAsyncCmp(() => import(/* webpackChunkName: "WidgetItem_ListSelect" */ './ListSelect')),
    PropsForm: ListSelectPropsForm,
  },
  TreeSelect: {
    desc: '树选择',
    Cmp: withAsyncCmp(() => import(/* webpackChunkName: "WidgetItem_TreeSelect" */ './TreeSelect')),
    PropsForm: TreeSelectPropsForm,
  },
  TableSelect: {
    desc: '表格选择',
    Cmp: withAsyncCmp(() =>
      import(/* webpackChunkName: "WidgetItem_TableSelect" */ './TableSelect'),
    ),
    PropsForm: TableSelectPropsForm,
  },
};
