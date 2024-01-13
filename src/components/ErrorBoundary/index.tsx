import React, { ErrorInfo, ReactNode } from 'react';

interface State {
  hasError: boolean;
}

interface Props {
  moduleName?: string;
  children?: ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    // 更新 state，下次渲染可以展示错误相关的 UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { moduleName = 'App' } = this.props;
    // TODO 此处需要设置上报
    console.error(`🔥 [${moduleName}] error`, error, info);
  }

  render() {
    const hasError = this.state?.hasError;
    const { children, moduleName = 'App' } = this.props;
    if (hasError) {
      // 渲染出错时的 UI
      return <h1>{moduleName} has an error</h1>;
    }
    return children;
  }
}
