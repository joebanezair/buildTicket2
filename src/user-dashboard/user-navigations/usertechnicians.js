import React, { useEffect, useState } from 'react'
import { auth, database } from '../../firebase/firebase';
import Moderator from '../../context/Moderator';
import { onValue, ref } from 'firebase/database';

const UserTechnicians = () => {
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

export default UserTechnicians

const UserTechniciansProfile =()=>{
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
  return(<>
     {filteredUser.map((user) => (
        <div key={user.email}>
         <>
          <div id='MetaTech'>
           <div>Name: <span>{user.name} {user.lastName}</span></div>
           <div>Email: <span>{user.email}</span></div>
           <div>E/S no#: <span>{user.studentNo}</span></div>
           <div>Role: <span>{user.role}</span></div>
          </div>
         </>
       </div>
     ))}
  </>)
}

export {UserTechniciansProfile};