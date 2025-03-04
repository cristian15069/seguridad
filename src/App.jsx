// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componets/Login.jsx'
import Home from './componets/Home.jsx';
import Action from './componets/Action.jsx';
import './App.css'


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/action" element={<Action />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
