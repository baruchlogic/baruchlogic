import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
  </Switch>
);

export default App;
