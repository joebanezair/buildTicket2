import React from 'react'
import { useNavigate } from 'react-router-dom'

const NavigationDashboard = () => {
  const routerNav = useNavigate();
  const login = () => {
    routerNav('/login');
  }
   
  const home = () => {
    routerNav('/');
  }
  const knbase = () => {
    routerNav('/knowledge-base');
  }
  const aboutus = () => {
    routerNav('/about-us');
  }
  return (
    <>
     <nav id='nav-standards'>
        <button onClick={home}>Home</button>
        <button onClick={knbase}>Fixable Issues</button>
        <button onClick={aboutus}>About Us</button>
        <button onClick={login}>Sign-in Sign-up</button>
     </nav>
    </>
  )
}

export default NavigationDashboard