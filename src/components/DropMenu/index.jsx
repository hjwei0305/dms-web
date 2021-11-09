import React, { useState } from 'react';
import { Dropdown, Menu, Icon } from 'antd';
import cls from 'classnames';
import Space from '@/components/Space';

import styles from './index.less';

const DropMenu = ({
  width,
  trigger = ['click'],
  menuItems = [],
  icon,
  label,
  defalutSelectedKey,
  onSelect,
}) => {
  const [selectedKey, setSelectedKey] = useState(defalutSelectedKey);
  const [selectedItem] = menuItems.filter(({ key }) => key === selectedKey);
  const { value: showValue } = selectedItem || {};
  return (
    <Dropdown
      width={width}
      trigger={trigger}
      overlay={
        <Menu
          className={cls(styles['drop-menu'])}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            setSelectedKey(key);
            if (onSelect) {
              onSelect(key);
            }
          }}
        >
          {menuItems.map(({ key, value }) => (
            <Menu.Item key={key}>
              <div
                style={{
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: 20,
                    textAlign: 'center',
                  }}
                >
                  {selectedKey === key ? <Icon type="check" /> : null}
                </div>
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  {value}
                </div>
              </div>
            </Menu.Item>
          ))}
        </Menu>
      }
    >
      <Space
        style={{
          cursor: 'pointer',
        }}
        onClick={e => e.preventDefault()}
      >
        {icon && <Icon type={icon} />}
        {label}
        <span
          style={{
            color: 'rgba(0,0,0,.85)',
            fontWeight: 700,
          }}
        >
          {showValue} <Icon type="down" />
        </span>
      </Space>
    </Dropdown>
  );
};

export default DropMenu;
