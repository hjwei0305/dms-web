import React, { Component } from 'react';
import cls from 'classnames';
import { Input } from 'antd';
import { Draggable } from 'react-beautiful-dnd';

import styles from './index.less';

class ExtDragInput extends Component {
  render() {
    const { name, schema } = this.props;
    return (
      <Draggable draggableId={name} index={schema.index}>
        {(provided, snapshot) => (
          <div
            className={cls(styles['ext-input'])}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <Input />
          </div>
        )}
      </Draggable>
    );
  }
}

export default ExtDragInput;
