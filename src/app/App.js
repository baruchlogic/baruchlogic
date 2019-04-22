import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import About from './About';
import Home from './Home';
import Login from './Login';
import VideosContainer from './VideosContainer';
const Text = () => <div>Text</div>;
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
      <Route exact path="/login" component={Login} />
    </Switch>
  </div>
);

const StyledApp = styled(App)`
  box-sizing: border-box;
`;

export default StyledApp;
