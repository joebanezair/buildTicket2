import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import Dashboard from './dashboard/dashboard'
import LoadUser from './user-dashboard/load-user-data/loadUser'
import PublicHomePage from './public-home-page/PublicHomePage'

const App = () => {
  return (
    <>
      <Router>
       <AuthProvider>
         <Routes>
          <Route path="/" Component={PublicHomePage} />
          <Route path="/load" Component={LoadUser} />
          <Route path="/login" Component={Dashboard} /> 
        </Routes>
       </AuthProvider>  
      </Router>
    </>
  )
}

export default App;
