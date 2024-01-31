import React, { useEffect, useState } from 'react'
import { auth, database } from '../../firebase/firebase';
import Moderator from '../../context/Moderator';
import { onValue, ref } from 'firebase/database';

const UserTeachers = () => {
  const {email} = Moderator();
  const logOut = () => {
    auth.signOut()
      .then(() => {
        alert('Logout successful');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

   //filtering-user-data
   const [registeredUser, setRegistered] = useState([]);
   const [filteredUser, setFiltered] = useState([]);
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
   //filtering-user-data

  return(<>
      <nav id='nav-standards'>
       {filteredUser.map((user) => (
        <div key={user.email}>
          <>
            <button>{user.name} {user.lastName}</button>
            <button onClick={logOut}>log-out</button>
            <span id='role' disabled>Role: <span id='roleme'>{user.role}</span></span>
          </>
         </div>
        ))}
      </nav>
    </>)
}

export default UserTeachers