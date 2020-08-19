import React from 'react';
import moment from 'moment';
import { Tag } from 'antd';

const formatDate = value => moment.format(value, 'YYYY-MM-DD');
const formatText = value => value;
const formatBool = value => <Tag color={value ? 'red' : 'green'}>{value ? '是' : '否'}</Tag>;

export default {
  formatDate,
  formatText,
  formatBool,
};
