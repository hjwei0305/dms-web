import React, { Component } from 'react';
import { get, isPlainObject } from 'lodash';
import { ComboGrid } from 'suid';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;

class ExtComboGrid extends Component {
  getComboGridProps = () => {
    const { schema, value } = this.props;
    let store = null;
    let tempValue = value;
    const contextPath = get(schema, 'ExtComboGrid.dataModelCode');
    if (contextPath) {
      store = {
        type: 'POST',
        url: `${MDMSCONTEXT}/${contextPath}/findByPage`,
      };
    }
    const FieldItems = get(schema, 'ExtComboGrid.cfg', '[]');
    const columns = [];
    let showField = '';
    FieldItems.forEach(it => {
      const { hidden, isShowField, name, code } = it;
      if (!hidden) {
        columns.push({
          title: name,
          dataIndex: code,
        });
      }
      if (isShowField) {
        showField = code;
      }
      if (isPlainObject(value)) {
        tempValue = value[showField];
      }
    });
    return {
      value: tempValue,
      store,
      reader: {
        name: showField,
      },
      columns,
      remotePaging: true,
    };
  };

  handleAfterSelected = item => {
    const { name, onChange, schema } = this.props;
    const FieldItems = get(schema, 'ExtComboGrid.cfg', '[]');
    const submitFields = [];
    let showField = '';
    FieldItems.forEach(it => {
      const { sumitField, isSubmit, code, isShowField } = it;
      if (isSubmit) {
        submitFields.push({
          from: code,
          to: sumitField,
        });
      }
      if (isShowField) {
        showField = code;
      }
    });
    if (onChange) {
      if (submitFields && submitFields.length) {
        const tempValue = {
          [name]: item[showField],
        };
        submitFields.forEach(it => {
          const { from: orgion, to: target } = it;
          Object.assign(tempValue, {
            [target]: item[orgion],
          });
        });
        onChange(`${name}__ds`, tempValue);
      } else {
        onChange(name, item[showField]);
      }
    }
  };

  render() {
    return (
      <div
        style={{
          width: '100%',
        }}
      >
        <ComboGrid
          afterSelect={this.handleAfterSelected}
          style={{ width: '100%' }}
          {...this.getComboGridProps()}
        />
      </div>
    );
  }
}

export default ExtComboGrid;
