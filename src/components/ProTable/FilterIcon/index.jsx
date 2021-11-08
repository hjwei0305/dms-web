import React, { useState } from 'react';
import { ExtIcon } from 'suid';
import cls from 'classnames';
import { isPlainObject } from 'lodash';
import Space from '@/components/Space';
import DrawerForm from '@/components/DrawerForm';

import styles from './index.less';

const FilterIcon = props => {
  const { filterForm, onOk, onClear } = props;
  const [visible, setVisible] = useState(false);
  const [filterParam, setFilterParam] = useState(null);
  const {
    width: drawerWidth,
    drawerProps = {
      layout: 'vertical',
    },
    render: renderDrawerFormItems,
    filterCfg,
  } = filterForm || {};

  const showClear = !!filterParam;

  if (!isPlainObject(filterForm)) {
    return null;
  }

  const handleOk = values => {
    if (onOk) {
      const filters = [];
      (filterCfg || []).forEach(({ name, operator = 'EQ' }) => {
        if (values[name] === false || !!values[name]) {
          filters.push({
            fieldName: name,
            operator,
            fieldType: 'sting',
            value: values[name],
          });
        }
      });
      onOk(filters);
    }
    setFilterParam(values);
    setVisible(false);
  };

  const drawerFormProps = {
    drawerKey: filterParam,
    title: '过滤',
    visible,
    width: drawerWidth,
    ...drawerProps,
    onOk: handleOk,
    onClose: () => setVisible(false),
    renderFormItems: (form, FormItem) =>
      renderDrawerFormItems && renderDrawerFormItems(form, FormItem, filterParam),
  };

  return (
    <>
      <Space
        className={cls({
          [styles['filter-icon']]: true,
          [styles.filter]: showClear,
        })}
        onClick={() => {
          setVisible(true);
        }}
      >
        <span>
          <ExtIcon type="filter" style={{ fontSize: 16 }} />
          <span>过滤</span>
        </span>
        {showClear ? (
          <ExtIcon
            type="close"
            className="btn-clear"
            antd
            onClick={e => {
              e.stopPropagation();
              setFilterParam(null);
              if (onOk) {
                onOk([]);
              }
            }}
            tooltip={{ title: '清除过滤条件', placement: 'bottomRight' }}
            style={{ fontSize: 14 }}
          />
        ) : null}
      </Space>
      <DrawerForm {...drawerFormProps} />
    </>
  );
};

export default FilterIcon;
