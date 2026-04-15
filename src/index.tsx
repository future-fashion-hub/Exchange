// src\app\index.tsx

import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './app/App';
import './normalize.css';
import './index.css';
import { Provider } from 'react-redux';
import store from './services/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
