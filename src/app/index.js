import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

// import 'normalize.css/normalize.css';
// import '@blueprintjs/core/lib/css/blueprint.css';
// import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import './index.css';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  window.document.getElementById('root')
);
