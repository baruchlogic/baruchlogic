import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import About from './About';
import Home from './Home';
import Login from './Login';
import VideosContainer from './VideosContainer';
import Textbook from './Textbook';
const ExercisesContainer = () => <div>Exercises</div>;
import ProblemsetsContainer from './ProblemsetsContainer';

const App = () => (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/text" component={Textbook} />
      <Route exact path="/videos/:short_title?" component={VideosContainer} />
      <Route exact path="/exercises/:id?" component={ExercisesContainer} />
      <Route exact path="/homework" component={ProblemsetsContainer} />
      <Route exact path="/login" component={Login} />
    </Switch>
  </div>
);

export default App;
