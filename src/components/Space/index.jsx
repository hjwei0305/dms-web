import React from 'react';
import cls from 'classnames';
import Item from './Item';

import './index.less';

// export interface SpaceProps {
//   prefixCls?: string;
//   className?: string;
//   style?: React.CSSProperties;
//   size?: SizeType | number;
//   direction?: 'horizontal' | 'vertical';
//   // No `stretch` since many components do not support that.
//   align?: 'start' | 'end' | 'center' | 'baseline';
// }

const Space = props => {
  const {
    size = 'small',
    align,
    className,
    children,
    direction = 'horizontal',
    ...otherProps
  } = props;

  const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;
  const cn = cls(
    'space',
    `space-${direction}`,
    {
      [`space-align-${mergedAlign}`]: mergedAlign,
    },
    className,
  );

  const itemClassName = 'space-item';

  const marginDirection = 'marginRight';

  // Calculate latest one
  const nodes = React.Children.map(children, (child, i) => {
    if (child !== null && child !== undefined) {
      /* eslint-disable react/no-array-index-key */
      return (
        <Item
          className={itemClassName}
          key={`${itemClassName}-${i}`}
          direction={direction}
          size={size}
          index={i}
          marginDirection={marginDirection}
        >
          {child}
        </Item>
      );
    }
  });

  if (nodes.every(node => !node)) {
    return null;
  }

  return (
    <div className={cn} {...otherProps}>
      {nodes}
    </div>
  );
};

export default Space;
