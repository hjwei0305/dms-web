import React from 'react';

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

// export interface ItemProps {
//   className: string;
//   children: React.ReactNode;
//   index: number;
//   direction?: 'horizontal' | 'vertical';
//   size?: SizeType | number;
//   marginDirection: 'marginLeft' | 'marginRight';
// }

export default function Item({ className, direction, size, marginDirection, children }) {
  return (
    <div
      className={className}
      style={{
        [direction === 'vertical' ? 'marginBottom' : marginDirection]:
          typeof size === 'string' ? spaceSize[size] : size,
      }}
    >
      {children}
    </div>
  );
}
