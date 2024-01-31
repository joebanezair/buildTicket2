import { child, get, ref as postRef, push, set, update } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { database } from '../firebase/firebase';
import Moderator from '../context/Moderator';
import Login from './login';
import ConfirmUsers from '../user-approval/approveUsers';
import NavigationDashboard from '../other-components/dashboard-navigation/NavigationDashboard';
// import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

const Signup = () => {
  const {email} = Moderator();
  const currentDate = new Date();
  const emailRegex = /^[A-Za-z0-9._%+-]+@globalcity.sti.edu.ph$/;
  const studentNumberRegex = /^02000\d{6}$/; // Matches "02000" followed by exactly 6 digits
  const initialUserData = {
    name: '',
    lastName: '',
    email: '',
    studentNo: '',
    password: '',
  };
  const [userData, setUserData] = useState(initialUserData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      console.log('Error:', error);
    }
  }, [error]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the fields are empty
    if (
      userData.name === '' ||
      userData.lastName === '' ||
      userData.email === '' ||
      userData.studentNo === '' ||
      userData.password === ''
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (!emailRegex.test(userData.email)) {
      setError('Invalid email address. Please use a valid globalcity.sti.edu.ph email.');
      return;
    }

    if (!studentNumberRegex.test(userData.studentNo)) {
      setError('Student number must start with "02000" and be followed by 6 digits.');
      return;
    }

    if (userData.password.length < 6) { // Password length check
      setError('Password should be longer than 6 characters.');
      return;
    }
    //-editable
    const studentNoToCheck = userData.studentNo;
    const confirmSigneesRef = postRef(database, 'ConfirmSignees');
    // First, check if the student number already exists
    get(child(confirmSigneesRef, studentNoToCheck))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Student number already exists in ConfirmSignees collection
          setError('Student number already exists.\nPlease use a different number.');
        } else {
          // Student number doesn't exist, so you can add the userData
          const currentDate = new Date();
          const newSigneeData = {
            ...userData,
            date: currentDate.toLocaleDateString(),
            time: currentDate.toLocaleTimeString(),
          };
    
          // Use the student number as the key and set the data
          set(child(confirmSigneesRef, studentNoToCheck), newSigneeData)
            .then(() => {
              setError(
                "Signing-up successful. Please wait for admin's confirmation.\nYou can view your registered account in the registered panel by clicking here."
              );
            })
            .catch((error) => {
              setError('Error adding signee data: ' + error.message);
            });
        }
      })
      .catch((error) => {
        setError('Error checking student number: ' + error.message);
      });
    //-editable
    console.log('User Data:', userData);
    setError('Signing-up...');
    // Clear the form fields after submission
    setUserData(initialUserData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validate "Student No#" to allow only numbers
    if (name === 'studentNo' && !/^[0-9]*$/.test(value)) {
      return; // Do not update the state if it contains non-numeric characters
    }
    setUserData({
      ...userData,
      [name]: value
    });
  };

  return !email ? (
   <>
    <div id='sign-form'>
      <div>Sign Up</div>
      <form onSubmit={handleFormSubmit}>
       <div id='grid-sign'>
        <div>
            <label htmlFor="name">Name:</label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <br />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
            />
          </div>
       </div>
       
       <div id='grid-sign'>
       <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email.toLocaleLowerCase()}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="studentNo">Student No#:</label>
          <br />
          <input
            type="text"
            id="studentNo"
            name="studentNo"
            value={userData.studentNo}
            onChange={handleInputChange}
          />
        </div>
       </div>

       <div id='grid-sign'>
       <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
          />
        </div>
       </div>
        
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
      <>
        <div>
        {error && <div className="error">{error}</div>}
        </div>
      </>
    </div>
   </>
  ) : (
    <Login />
  );
};

export default Signup;
