import React, { useMemo } from 'react';
import { Row, Col } from 'antd';
import { get, cloneDeep } from 'lodash';
import formWidgetItems from '@/components/WidgetItems';

const EasyForm = ({ form, FormItem, fields, initialValues, colSpan }) => {
  const { Cmp: Input } = formWidgetItems.Input;

  const intactFields = useMemo(() => {
    const tempFields = cloneDeep(fields);
    tempFields.forEach(it => {
      const { preFields, submitFields = [], name } = it;
      if (preFields && preFields.length) {
        preFields.forEach(field => {
          tempFields.forEach(item => {
            const tempChildSubmitFields = item.submitFields || [];
            if ([item.name].concat(tempChildSubmitFields).includes(field)) {
              const dependenciedFields = (item.dependenciedFields || []).concat(
                [name],
                submitFields,
              );
              Object.assign(item, { dependenciedFields });
            }
          });
        });
      }
    });
    return tempFields;
  }, [fields]);

  const renderSubmitFields = submitFields => {
    return submitFields.map(name => {
      return (
        <Col key={name} span={0}>
          <FormItem name={name} initialValue={get(initialValues, name)} hidden>
            <Input />
          </FormItem>
        </Col>
      );
    });
  };

  return (
    <Row>
      {intactFields.map(it => {
        const {
          required,
          type,
          rule,
          label,
          hidden,
          defaultField,
          name,
          submitFields = [],
          dependenciedFields = [],
          preFields = [],
          ...rest
        } = it;
        console.log('rule', rule);
        const FormComponent = (formWidgetItems[type] && formWidgetItems[type].Cmp) || Input;
        return (
          <>
            {renderSubmitFields(submitFields)}
            <Col key={name} span={hidden ? 0 : colSpan}>
              <FormItem
                label={label}
                name={name}
                initialValue={get(initialValues, defaultField || name)}
                rules={[
                  {
                    required,
                    message: `${label}不能为空`,
                  },
                ]}
                hidden={hidden}
              >
                <FormComponent
                  {...rest}
                  name={name}
                  submitFields={submitFields}
                  form={form}
                  dependenciedFields={dependenciedFields}
                  preFields={preFields}
                />
              </FormItem>
            </Col>
          </>
        );
      })}
    </Row>
  );
};

export default EasyForm;
