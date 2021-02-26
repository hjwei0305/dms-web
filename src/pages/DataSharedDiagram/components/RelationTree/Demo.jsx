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
        const { name = '', appName, isRoot, frozen } = cfg;

        const textConfig = {
          textAlign: 'center',
          textBaseline: 'middle',
        };

        const circle = group.addShape('circle', {
          attrs: {
            r: isRoot ? 30 : 20,
            stroke: isRoot && frozen ? 'red' : 'rgba(0, 0, 0, 0.25)',
            cursor: 'pointer',
            fill: '#fff',
          },
          name: 'node-add',
        });

        const circleBBox = circle.getBBox();

        group.addShape('text', {
          attrs: {
            ...textConfig,
            x: 0,
            y: 0,
            text: isRoot ? name : appName,
            fontSize: 8,
            fill: '#000',
            opacity: 0.85,
          },
        });

        group.addShape('text', {
          attrs: {
            ...textConfig,
            x: 0,
            y: circleBBox.maxY / 2,
            text: isRoot ? '主数据' : '应用',
            fontSize: 6,
            fill: '#000',
            opacity: 0.5,
          },
        });

        this.drawLinkPoints(cfg, group);
        return circle;
      },
      afterDraw(cfg, group) {
        const { isRoot, frozen } = cfg;
        if (isRoot && !frozen) {
          const r = isRoot ? 30 : 20;
          // 第一个背景圆
          const back1 = group.addShape('circle', {
            zIndex: -3,
            attrs: {
              x: 0,
              y: 0,
              r,
              fill: cfg.color,
              opacity: 0.6,
            },
            name: 'circle-shape1',
          });
          // 第二个背景圆
          const back2 = group.addShape('circle', {
            zIndex: -2,
            attrs: {
              x: 0,
              y: 0,
              r,
              fill: 'blue', // 为了显示清晰，随意设置了颜色
              opacity: 0.6,
            },
            name: 'circle-shape2',
          });
          // 第三个背景圆
          const back3 = group.addShape('circle', {
            zIndex: -1,
            attrs: {
              x: 0,
              y: 0,
              r,
              fill: 'green',
              opacity: 0.6,
            },
            name: 'circle-shape3',
          });
          group.sort(); // 排序，根据 zIndex 排序

          // 第一个背景圆逐渐放大，并消失
          back1.animate(
            {
              r: r + 10,
              opacity: 0.1,
            },
            {
              repeat: true, // 循环
              duration: 3000,
              easing: 'easeCubic',
              delay: 0, // 无延迟
            },
          );

          // 第二个背景圆逐渐放大，并消失
          back2.animate(
            {
              r: r + 10,
              opacity: 0.1,
            },
            {
              repeat: true, // 循环
              duration: 3000,
              easing: 'easeCubic',
              delay: 1000, // 1 秒延迟
            },
          ); // 1 秒延迟

          // 第三个背景圆逐渐放大，并消失
          back3.animate(
            {
              r: r + 10,
              opacity: 0.1,
            },
            {
              repeat: true, // 循环
              duration: 3000,
              easing: 'easeCubic',
              delay: 2000, // 2 秒延迟
            },
          );
        }
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
            lineDash: frozen && [2, 2, 2],
            endArrow: !frozen && {
              // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
              path: G6.Arrow.triangle(5, 5, 10),
              // 箭头的偏移量，负值代表向 x 轴正方向移动
              fill: 'lightblue',
              stroke: 'lightblue',
              opacity: 0.8,
            },
          },
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
              // type: 'collapse-expand',
              onChange: (item, collapsed) => {
                const tdata = item.get('model');
                tdata.collapsed = collapsed;
                return false;
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
