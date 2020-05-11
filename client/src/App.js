import React from 'react';
//router
import { BrowserRouter as Router, Route } from "react-router-dom"
//redux
import {Provider} from 'react-redux'
import store from './store'

import './App.css';
import Navbar from './component/layout/Navbar'
import Landing from './component/layout/Landign'
import Register from './component/auth/Register'
import Login from './component/auth/Login'

function App() {
  return (
    <Provider>
    <Router>
    <div className="App">
      <Navbar/>
      <Route exact path="/" component={Landing}/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/login" component={Login}/>
    </div>
    </Router>
    </Provider>
  );
}

export default App;
