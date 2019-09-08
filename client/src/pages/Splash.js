import React, { useContext } from "react";
import Login from '../components/Auth/Login'
import Context from '../../src/context'
import App from './App'

import { Redirect } from 'react-router-dom'

const Splash = () => {
  const { state } = useContext(Context)
  return state.isAuth ? <Redirect to='/' /> : <Login />
};

export default Splash;
