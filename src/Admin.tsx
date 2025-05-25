import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AdminApp';
import './admin.css';

ReactDOM.createRoot(
  document.getElementById('admin-root') as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
