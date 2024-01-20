import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyleProvider } from '@ant-design/cssinjs';

import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { reportWebVitals } from './reportWebVitals';
import { ErrorBoundary } from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <StyleProvider hashPriority="high">
        <App />
      </StyleProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
