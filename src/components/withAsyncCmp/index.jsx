import React from 'react';
import { Spin } from 'antd';
// import { nanoid } from 'nanoid';
// import NProgress from 'nprogress';

import lodinggif from './82.gif';

// import 'nprogress/nprogress.css';

const asyncComponent = loadComponent =>
  class AsyncComponent extends React.Component {
    state = {
      Component: null,
    };

    componentDidMount() {
      if (this.hasLoadedComponent()) {
        return;
      }
      // if (document.querySelector(`#${this.loadingId}`)) {
      //   NProgress.configure({
      //     parent: `#${this.loadingId}`,
      //     showSpinner: false,
      //   });
      //   // NProgress.start();
      // }

      loadComponent()
        .then(module => module.default)
        .then(Component => {
          // NProgress.done();
          this.setState({ Component });
        })
        .catch(err => {
          throw err;
        });
    }

    // loadingId = `np_${nanoid()}`;

    hasLoadedComponent = () => {
      const { Component } = this.state;
      return Component !== null;
    };

    render() {
      const { Component } = this.state;
      return Component ? (
        <Component {...this.props} />
      ) : (
        <div
          // id={this.loadingId}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin indicator={<img src={lodinggif} alt="" />} spinning />
        </div>
      );
    }
  };

export default asyncComponent;
