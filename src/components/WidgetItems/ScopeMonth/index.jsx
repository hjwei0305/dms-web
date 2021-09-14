import React, { useState, useEffect } from 'react';
import cls from 'classnames';
import moment from 'moment';
import { DatePicker } from 'antd';

import styles from './index.less';

const { MonthPicker } = DatePicker;

const ScopeMonth = ({
  value = [],
  splitStr = '~',
  onChange,
  submitFields,
  form,
  disabled,
  isView,
}) => {
  const [sMonth = null, eMonth = null] = value;
  const [state, setState] = useState({
    startMonth: sMonth,
    endMonth: eMonth,
  });

  const handleChange = (startMonth, endMonth) => {
    if (onChange) {
      if (startMonth && endMonth) {
        onChange([startMonth, endMonth]);
      } else {
        onChange([]);
      }
    }
  };

  const disabledStartDate = startValue => {
    if (!startValue || !state.endMonth) {
      return false;
    }
    return startValue.valueOf() > moment(state.endMonth).valueOf();
  };

  const disabledEndDate = endValue => {
    if (!endValue || !state.startMonth) {
      return false;
    }
    return endValue.valueOf() < moment(state.startMonth).valueOf();
  };

  useEffect(() => {
    const { startMonth, endMonth } = state;
    if (form && submitFields && submitFields.length) {
      form.setFieldsValue({
        [submitFields[0]]: startMonth,
        [submitFields[1]]: endMonth,
      });
      handleChange(startMonth, endMonth);
    }
  }, [state]);

  if (isView) {
    return <>{`${sMonth}${splitStr}${eMonth}`}</>;
  }

  return (
    <div className={cls(styles['scope-month'])}>
      <div className={cls('start-month')}>
        <MonthPicker
          disabled={disabled}
          disabledDate={disabledStartDate}
          defaultValue={state.startMonth && moment(state.startMonth)}
          style={{
            width: '100%',
          }}
          onChange={(_, startMonthStr) => {
            setState(s => ({
              ...s,
              startMonth: startMonthStr,
            }));
          }}
        />
      </div>
      <div className={cls('month-split')}>{splitStr}</div>
      <div className={cls('end-month')}>
        <MonthPicker
          defaultValue={state.endMonth && moment(state.endMonth)}
          disabled={disabled}
          disabledDate={disabledEndDate}
          style={{
            width: '100%',
          }}
          onChange={(_, endMonthStr) => {
            setState(s => ({
              ...s,
              endMonth: endMonthStr,
            }));
          }}
        />
      </div>
    </div>
  );
};

export default ScopeMonth;
