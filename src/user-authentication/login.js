import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import NavigationDashboard from '../other-components/dashboard-navigation/NavigationDashboard';

const Login = () => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@globalcity.sti.edu.ph$/;
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const router = useNavigate();
  const [error, setError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(loginData.username)) {
      setError("Invalid email address. Please use a valid globalcity.sti.edu.ph email.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, loginData.username, loginData.password);
      router('/login');
    } catch (err) {
      setError("Error: " + err.message);
      console.log(err.message);
    }

    // Clear the form data
    setLoginData({
      username: '',
      password: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (error) {
      console.log('Error:', error);
    }
  }, [error]);

  return (
   <div>
      <div id='login-form-container'>
        <div id='title'>Login</div>
        <form id='login-form' onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="username">Email:</label>
            <br/>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <br/>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <div>
            <button type="submit">Sign-in</button>
          </div>
        </form>
      </div>
   </div>
  );
};

export default Login;
