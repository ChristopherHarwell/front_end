import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom'

import Login from './pages/login/login'
import Register from './pages/register/register'
import UserDashboard from './pages/user-dashboard/user-dashboard'
import PrivateRoute from './utils/auth/private-route'

import UserForm from './pages/user-form/user-form'
import NavBar from './components/navbar/navbar'

function App() {
  return (
    <div className="App">

      <Route path='/' component={NavBar}></Route>

      <PrivateRoute exact path='/' component={UserDashboard}></PrivateRoute>
      <PrivateRoute path="/user-form" component={UserForm}></PrivateRoute>

      <Route path='/login' component={Login}></Route>
      <Route path='/register' component={Register}></Route>
    </div>
  );
}

export default App;
