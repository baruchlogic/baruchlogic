import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import LoadingGear from './LoadingGear';
const About = lazy(() => import('./About'));
const AdminContainer = lazy(() => import('./admin/AdminContainer'));
const Header = lazy(() => import('./Header'));
const Home = lazy(() => import('./Home'));
const Login = lazy(() => import('./Login'));
const ProblemsetsContainer = lazy(() => import('./ProblemsetsContainer'));
const Textbook = lazy(() => import('./Textbook'));
const VideosContainer = lazy(() => import('./VideosContainer'));
const ExercisesContainer = () => <div>Exercises</div>;

const App = () => (
  <div>
    <Suspense fallback={<LoadingGear />}>
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
        <Route
          exact
          path="/problemsets/:default_order?"
          component={ProblemsetsContainer}
        />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Suspense>
  </div>
);

export default App;
