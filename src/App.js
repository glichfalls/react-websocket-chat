import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/home";
import Error404 from "./pages/404";

import "./styles/main.css";
import Chat from "./pages/chat";
import Game from "./pages/game";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                      <Route exact={true} path="/home" component={Home} />
                      <Route exact={true} path="/" component={Home} />
                      <Route exact={true} path="/chat/:username" component={Chat} />
                      <Route exact={true} path={'/game'} component={Game} />
                      <Route component={Error404} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
