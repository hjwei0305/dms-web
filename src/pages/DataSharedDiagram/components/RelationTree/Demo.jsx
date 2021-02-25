import React, { Component } from 'react';
import G6 from '@antv/g6';

// 自定义节点、边
const registerFn = () => {
  /**
   * 自定义节点
   */
  G6.registerNode(
    'custom-circle',
    {
      shapeType: 'custom-circle',
      draw(cfg, group) {
        const { name = '', appName, isRoot } = cfg;

        const textConfig = {
          textAlign: 'left',
          textBaseline: 'bottom',
        };

        const circle = group.addShape('circle', {
          attrs: {
            x: 0,
            y: 0,
            r: isRoot ? 30 : 20,
            stroke: 'rgba(0, 0, 0, 0.25)',
            cursor: 'pointer',
            fill: '#fff',
          },
          name: 'node-add',
        });

        const circleBBox = circle.getBBox();

        group.addShape('text', {
          attrs: {
            ...textConfig,
            x: circleBBox.maxX - (isRoot ? 45 : 28),
            y: circleBBox.maxY - (isRoot ? 25 : 15),
            text: isRoot ? name : appName,
            fontSize: 8,
            fill: '#000',
            opacity: 0.85,
          },
        });

        this.drawLinkPoints(cfg, group);
        return circle;
      },
      update(cfg, item) {
        const group = item.getContainer();
        this.updateLinkPoints(cfg, group);
      },
      setState(name, value, item) {
        if (name === 'collapse') {
          const group = item.getContainer();
          const collapseText = group.find(e => e.get('name') === 'collapse-text');
          if (collapseText) {
            if (!value) {
              collapseText.attr({
                text: '-',
              });
            } else {
              collapseText.attr({
                text: '+',
              });
            }
          }
        }
        if (name === 'hover') {
          const group = item.getContainer();
          const nodeAddText = group.find(e => e.get('name') === 'node-add-text');
          const nodeAdd = group.find(e => e.get('name') === 'node-add');
          if (nodeAddText) {
            if (!value) {
              nodeAddText.attr({
                opacity: 0,
              });
              nodeAdd.attr({
                opacity: 0,
              });
            } else {
              nodeAddText.attr({
                opacity: 1,
              });
              nodeAdd.attr({
                opacity: 1,
              });
            }
          }
        }
      },
      getAnchorPoints() {
        return [
          [0, 0.5],
          [1, 0.5],
        ];
      },
    },
    'circle',
  );

  G6.registerEdge(
    'line-arrow',
    {
      draw(cfg, group) {
        const { startPoint, endPoint, target } = cfg;
        const { frozen } = target._cfg.model;
        const keyShape = group.addShape('path', {
          attrs: {
            path: [
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x, endPoint.y],
            ],
            stroke: frozen ? 'red' : 'lightblue',
            lineWidth: 2,
            // lineAppendWidth: 5,
            // startArrow: {
            //   // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
            //   path: G6.Arrow.triangle(5, 5, 15),
            //   // 箭头的偏移量，负值代表向 x 轴正方向移动
            //   // d: -20,
            //   // v3.4.1 后支持各样式属性
            //   fill: 'lightblue',
            //   stroke: 'lightblue',
            //   opacity: 0.8,
            //   // ...
            // },
            lineDash: frozen && [2, 2, 2],
            endArrow: !frozen && {
              // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
              path: G6.Arrow.triangle(5, 5, 10),
              // 箭头的偏移量，负值代表向 x 轴正方向移动
              // d: -10,
              // v3.4.1 后支持各样式属性
              fill: 'lightblue',
              stroke: 'lightblue',
              opacity: 0.8,
              // ...
            },
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'path-shape',
        });
        if (!frozen) {
          const circle = group.addShape('circle', {
            attrs: {
              x: startPoint.x,
              y: startPoint.y,
              fill: '#1890ff',
              r: 3,
            },
            name: 'circle-shape',
          });
          circle.animate(
            ratio => {
              // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
              // get the position on the edge according to the ratio
              const tmpPoint = keyShape.getPoint(ratio);
              // returns the modified configurations here, x and y here
              return {
                x: tmpPoint.x,
                y: tmpPoint.y,
              };
            },
            {
              repeat: true, // Whether executes the animation repeatly
              duration: 3000, // the duration for executing once
            },
          );
        }
        return keyShape;
      },
    },
    'single-line',
  );
};

class Demo1 extends Component {
  componentDidMount() {
    registerFn();
    const { data } = this.props;
    if (this.container && data) {
      const width = this.container.scrollWidth;
      const height = this.container.scrollHeight || 500;
      this.graph = new G6.TreeGraph({
        container: this.container, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width, // Number，必须，图的宽度
        height, // Number，必须，图的高度
        linkCenter: true,
        fitView: true,
        fitViewPadding: 80,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: (item, collapsed) => {
                const tdata = item.get('model');
                tdata.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          type: 'custom-circle',
        },
        defaultEdge: {
          type: 'line-arrow',
        },
        layout: {
          type: 'compactBox',
          direction: 'RL',
          // getId: function getId(d) {
          //   return d.id;
          // },
          // getHeight: () => {
          //   return 26;
          // },
          // getWidth: () => {
          //   return 26;
          // },
          getVGap: () => {
            return 20;
          },
          getHGap: () => {
            return 30;
          },
          radial: true,
        },
      });
      this.graph.data(data); // 读取 Step 2 中的数据源到图上
      this.graph.render(); // 渲染图
      this.graph.fitCenter();
      this.graph.fitView();
    }
    window.onresize = () => {
      if (!this.graph || this.graph.get('destroyed')) return;
      if (!this.container || !this.container.scrollWidth || !this.container.scrollHeight) return;
      this.graph.changeSize(this.container.scrollWidth, this.container.scrollHeight);
      this.graph.fitCenter();
      this.graph.fitView();
    };
  }

  render() {
    return <div style={{ height: '100%' }} ref={ref => (this.container = ref)} />;
  }
}

export default Demo1;
