import React, { Component } from 'react';
import { get } from 'lodash';
import { ComboGrid } from 'suid';

class ExtComboGrid extends Component {
  getComboGridProps = () => {
    const { schema } = this.props;
    const columns = JSON.parse(get(schema, 'ExtComboGrid.columns', '[]'));
    return {
      ...get(schema, 'ExtComboGrid'),
      reader: {
        name: get(schema, 'ExtComboGrid.showField', 'name'),
      },
      columns,
    };
  };

  handleAfterSelected = item => {
    const { name, onChange, schema, rootValue } = this.props;
    console.log('ExtComboGrid -> rootValue', rootValue);
    console.log('ExtComboGrid -> schema', schema);
    const showField = get(schema, 'ExtComboGrid.showField', 'name');
    const submitFields = JSON.parse(get(schema, 'ExtComboGrid.submitFields', '[]'));
    console.log('ExtComboGrid -> handleAfterSelected -> item', item);
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
