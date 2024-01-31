import React, { useEffect, useState } from 'react'
import { database } from '../../firebase/firebase';
import Moderator from '../../context/Moderator';
import { onValue, ref } from 'firebase/database';


const UserProfile = () => {
 //filtering-user-data
 const {email} = Moderator();
 const [registeredUser, setRegistered] = useState([]);
 const [filteredUser, setFiltered] = useState([]);
 // const slice = email.slice(0, 2);
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
  return (<>
     {filteredUser.map((user) => (
        <div key={user.email}>
         <>
          <div id='MetaTech'>
           <div>Name: <span>{user.name} {user.lastName}</span></div>
           <div>Email: <span>{user.email}</span></div>
           <div>E/S no#: <span>{user.studentNo}</span></div>
           <div>Role: <span>{user.role}</span></div>
           <div>Account Status: <span>{user.status}</span></div>
           <div>Password: <span>{user.password}</span></div>
          </div>
         </>
       </div>
     ))}
  </>)
}

export default UserProfile