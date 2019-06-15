import React from 'react';
import { Switch, Route } from 'react-router-dom';
import About from './About';
import AdminContainer from './admin/AdminContainer';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import ProblemsetsContainer from './ProblemsetsContainer';
import Textbook from './Textbook';
import VideosContainer from './VideosContainer';
const ExercisesContainer = () => <div>Exercises</div>;

const App = () => (
  <div>
    <Switch>
      <Route path="/admin" component={AdminContainer} />
      <Route path="/" component={Header} />
    </Switch>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/text" component={Textbook} />
      <Route exact path="/videos/:short_title?" component={VideosContainer} />
      <Route exact path="/exercises/:id?" component={ExercisesContainer} />
      <Route exact path="/problemsets/:id?" component={ProblemsetsContainer} />
      <Route exact path="/login" component={Login} />
    </Switch>
  </div>
);

export default App;
