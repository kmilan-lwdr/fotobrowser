import React from 'react';
import { Route, Switch, Redirect, HashRouter, Link } from 'react-router-dom'
import { GalleryContainer } from './Containers/GalleryContainer';
import { ViewerContainer } from './Containers/ViewerContainer';

export default function App() {
  return (
    <div className="App">
      <HashRouter basename="/">
        <Link to='/' className="AppHeader">
          fotoBrowser
        </Link>
      
        <Switch>
          <Route path="/gallery" component={GalleryContainer} />
          <Route exact path="/" render={() => (<Redirect to="/gallery" />)} />           
          <Route path="/view/:id" component={ViewerContainer}/>      
          <Route path="*" render={() => (<Redirect to="/gallery" />)} />
        </Switch>
      </HashRouter>
      
    </div>
  );
}
