import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import App from './App';

import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
// import '@blueprintjs/icons/lib/css/blueprint-icons.css';

const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    font-family: 'Source Sans Pro', sans-serif !important;
  }
`;

render(
  <>
    <GlobalStyle />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>,
  window.document.getElementById('root')
);
