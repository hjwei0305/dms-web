import React, { Component } from 'react';
import { Popover } from 'antd';
import EditForm from './EditForm';

class EditPopover extends Component {
  state = {
    visible: false,
  };

  handleVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  handleSave = item => {
    const { onSave } = this.props;
    this.handleVisibleChange(false);
    if (onSave) {
      onSave(item);
    }
  };

  render() {
    const { visible } = this.state;
    const { children, editData, mapFieldLists } = this.props;
    const { name } = editData;
    return (
      <Popover
        content={
          <EditForm mapFieldLists={mapFieldLists} editData={editData} onSave={this.handleSave} />
        }
        title={`编辑字段【${name}】`}
        trigger="click"
        visible={visible}
        placement="rightTop"
        onVisibleChange={this.handleVisibleChange}
        overlayStyle={{ width: 500 }}
      >
        {children}
      </Popover>
    );
  }
}

export default EditPopover;
