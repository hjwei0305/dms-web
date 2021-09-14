import React, { useState, useEffect } from 'react';
import cls from 'classnames';
import moment from 'moment';
import { DatePicker } from 'antd';

import styles from './index.less';

const ScopeDate = ({
  value = [],
  splitStr = '~',
  onChange,
  submitFields,
  form,
  disabled,
  isView,
}) => {
  const [sDate = null, eDate = null] = value;
  const [state, setState] = useState({
    startDate: sDate,
    endDate: eDate,
  });

  const handleChange = (startDate, endDate) => {
    if (onChange) {
      if (startDate && endDate) {
        onChange([startDate, endDate]);
      } else {
        onChange([]);
      }
    }
  };

  const disabledStartDate = startValue => {
    if (!startValue || !state.endDate) {
      return false;
    }
    return startValue.valueOf() > moment(state.endDate).valueOf();
  };

  const disabledEndDate = endValue => {
    if (!endValue || !state.startDate) {
      return false;
    }
    return endValue.valueOf() < moment(state.startDate).valueOf();
  };

  useEffect(() => {
    const { startDate, endDate } = state;
    if (form && submitFields && submitFields.length) {
      form.setFieldsValue({
        [submitFields[0]]: startDate,
        [submitFields[1]]: endDate,
      });
      handleChange(startDate, endDate);
    }
  }, [state]);

  if (isView) {
    return <>{`${sDate}${splitStr}${eDate}`}</>;
  }

  return (
    <div className={cls(styles['scope-date'])}>
      <div className={cls('start-date')}>
        <DatePicker
          disabled={disabled}
          disabledDate={disabledStartDate}
          defaultValue={state.startDate && moment(state.startDate)}
          style={{
            width: '100%',
          }}
          onChange={(_, startDateStr) => {
            setState(s => ({
              ...s,
              startDate: startDateStr,
            }));
          }}
        />
      </div>
      <div className={cls('date-split')}>{splitStr}</div>
      <div className={cls('end-date')}>
        <DatePicker
          defaultValue={state.endDate && moment(state.endDate)}
          disabled={disabled}
          disabledDate={disabledEndDate}
          style={{
            width: '100%',
          }}
          onChange={(_, endDateStr) => {
            setState(s => ({
              ...s,
              endDate: endDateStr,
            }));
          }}
        />
      </div>
    </div>
  );
};

export default ScopeDate;
