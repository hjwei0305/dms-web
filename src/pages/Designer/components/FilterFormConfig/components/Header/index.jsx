import React from 'react';
import cls from 'classnames';
import { Popconfirm } from 'antd';
import { ExtIcon } from 'suid';

import styles from './index.less';

class Header extends React.Component {
  handleBack = () => {
    const { onBack } = this.props;
    if (onBack) {
      onBack();
    }
  };

  handleConfirm = () => {
    const { onSave } = this.props;
    if (onSave) {
      onSave();
    }
  };

  render() {
    const { dataModel, hasUpdate } = this.props;

    return (
      <div className={cls(styles['ui-header'])}>
        {hasUpdate ? (
          <Popconfirm
            title="表单配置有更新, 是否保存？"
            onConfirm={this.handleConfirm}
            placement="rightTop"
            onCancel={this.handleBack}
            okText="是"
            cancelText="否"
          >
            <span className={cls('back-icon')}>
              <ExtIcon type="left" antd />
            </span>
          </Popconfirm>
        ) : (
          <span className={cls('back-icon')} onClick={this.handleBack}>
            <ExtIcon type="left" antd />
          </span>
        )}
        {`主数据【${dataModel.name}】对应的UI过滤表单配置`}
      </div>
    );
  }
}

export default Header;
