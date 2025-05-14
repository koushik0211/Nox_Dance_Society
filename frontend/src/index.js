// Nox2/frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // This is for routing
import './index.css'; // Your global styles (now without Tailwind directives)
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* This enables routing for the whole app */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();