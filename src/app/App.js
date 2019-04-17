import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import About from './About';
import Home from './Home';

const Text = () => <div>Text</div>;
const VideosContainer = () => <div>Videos</div>;
const ExercisesContainer = () => <div>Exercises</div>;
const HomeworkContainer = () => <div>Homework</div>;

const App = () => (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/text" component={Text} />
      <Route exact path="/videos" component={VideosContainer} />
      <Route exact path="/exercises" component={ExercisesContainer} />
      <Route exact path="/homework" component={HomeworkContainer} />
    </Switch>
  </div>
);

export default App;
