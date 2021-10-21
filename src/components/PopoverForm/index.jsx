import React, { useState, useRef } from 'react';
import { Popover, Button, Row } from 'antd';
import { BannerTitle } from 'suid';
import Form from '@/components/ExtForm';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const PopoverForm = props => {
  const {
    onOk,
    extraParams,
    children,
    width = 400,
    confirmLoading,
    renderFormItems,
    title,
    subTitle,
    formProps = {},
  } = props;

  const form = useRef(null);
  const [visible, setVisible] = useState(false);

  const handleShowChange = v => {
    setVisible(v);
  };

  const handleSave = () => {
    form.current.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, extraParams, formData);
      if (onOk) {
        onOk(params);
        handleShowChange(false);
      }
    });
  };

  const getPopoverContent = () => {
    return (
      <div
        style={{
          width,
          overflow: 'hidden',
        }}
      >
        <BannerTitle
          style={{ display: 'block', margin: '16px 12px' }}
          title={title}
          subTitle={subTitle}
        />
        <Form
          {...formItemLayout}
          layout="horizontal"
          {...formProps}
          onRef={inst => (form.current = inst)}
        >
          {renderFormItems}
        </Form>
        <Row
          style={{
            float: 'right',
          }}
        >
          <Button onClick={handleSave} loading={confirmLoading} type="primary">
            确定
          </Button>
        </Row>
      </div>
    );
  };

  return (
    <Popover
      placement="rightTop"
      content={getPopoverContent()}
      onVisibleChange={v => handleShowChange(v)}
      trigger="click"
      destroyTooltipOnHide
      visible={visible}
    >
      {children}
    </Popover>
  );
};

export default PopoverForm;
