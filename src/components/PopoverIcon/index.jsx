import React from 'react';
import { ExtIcon } from 'suid';
import cls from 'classnames';

import './index.less';

const PopoverIcon = props => {
  const { className } = props;
  return <ExtIcon {...props} className={cls('popover-icon', className)} />;
};

export default PopoverIcon;
