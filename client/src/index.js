import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./pages/App";
import Splash from "./pages/Splash";
import Context from './context'
import Reducer from './reducer'

import ProtectedRoute from './ProtectedRoute'

import "mapbox-gl/dist/mapbox-gl.css";
import * as serviceWorker from "./serviceWorker";
import { stat } from "fs";

const Root = () => {
  const initialState = useContext(Context)
  const [state, dispatch] = useReducer(Reducer, initialState)
  return (
    <Context.Provider value={{state, dispatch }}>
      <Router>
        <Switch>
          <ProtectedRoute exact path="/" component={App} />
          <Route path="/login" component={Splash} />
        </Switch>
      </Router>
    </Context.Provider>

  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
