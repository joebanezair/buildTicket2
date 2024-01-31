import React, { useEffect, useState } from 'react';
import Moderator from '../../context/Moderator';
import { database } from '../../firebase/firebase';
import { onValue, ref } from 'firebase/database';
import Login from '../../user-authentication/login';

const LoadUser = () => {
  const [registeredUser, setRegistered] = useState([]);
  const [filteredUser, setFiltered] = useState([]);
  const { email } = Moderator();
  useEffect(() => {
    const fetchData = () => {
      const myreference = ref(database, 'RegisteredUsers');
      onValue(myreference, (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val(); // Get user data directly
          data.push(user);
        });
        setRegistered(data);
      });
    };
    fetchData();
  }, []);
  useEffect(() => {
    // Use a separate useEffect to handle filtering after registeredUser updates
    if (registeredUser.length > 0) {
      const filteredUsers = registeredUser.filter((user) => user.email === email);
      setFiltered(filteredUsers);
    }
  }, [registeredUser, email]);

  return email ? (
    <>
      {filteredUser.map((user) => (
        <div key={user.email}>
          <div>
            <div>Full name: {user.name}, {user.lastName}</div>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
            <div>{user.studentNo}</div>
          </div>
        </div>
      ))}
    </>
  ) : (
    <Login />
  )
}

export default LoadUser;
