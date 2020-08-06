import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import FormRender from 'form-render/lib/antd.js';
import ExtDragInput from './ExtDragInput';

// propsSchema 是配置 Form Render 的必备参数，使用标准的 JSON Schema 来描述表单结构
// const propSchema = {
//   type: 'object',
//   properties: {
//     test: {
//       "title": "显示更多",
//       // "type": "boolean",
//       "ui:widget": "extInput",
//     },
//     test1: {
//       "title": "测试1",
//       // "type": "boolean",
//       "ui:widget": "extInput",
//     },
//   },
//   required: [
//     'test'
//   ]
// };

// 通过uiSchema可以增强 Form Render 展示的丰富性，比如说日历视图
const uiSchema = {
  dateDemo: {
    'ui:widget': 'date',
  },
  // radioDemo: {
  //   "ui:width": "50%"
  // }
};

class Content extends Component {
  state = {
    properties: [
      [
        'test',
        {
          title: '显示更多',
          // "type": "boolean",
          'ui:widget': 'extInput',
        },
      ],
      [
        'test1',
        {
          title: '测试1',
          // "type": "boolean",
          'ui:widget': 'extInput',
        },
      ],
      [
        'test3',
        {
          title: '测试3',
          // "type": "boolean",
          'ui:widget': 'extInput',
        },
      ],
    ],
  };

  onDragStart = result => {
    console.log('Content -> result', result);
  };

  onDragEnd = result => {
    const { destination, source } = result;
    const { properties } = this.state;
    if (destination && source) {
      const arrItem = properties[destination.index];
      properties[destination.index] = properties[source.index];
      properties[source.index] = arrItem;
      this.setState({
        properties,
      });
    }
  };

  render() {
    const { properties } = this.state;

    const tempPropertiesObj = {};
    properties.forEach((item, index) => {
      const [key, value] = item;
      Object.assign(value, { index });
      Object.assign(tempPropertiesObj, { [key]: value });
    });

    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <Droppable droppableId="eidtboard" type="COLUMN" direction="horizontal">
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                height: '100%',
              }}
            >
              <FormRender
                // {...formProps}
                propsSchema={{
                  type: 'object',
                  properties: tempPropertiesObj,
                }}
                column={2}
                uiSchema={uiSchema}
                // formData={formData}
                onChange={this.onChange}
                onValidate={this.onValidate}
                widgets={{ extInput: ExtDragInput }}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default Content;
