import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase/firebase';
import Moderator from '../context/Moderator';
import { onValue, ref } from 'firebase/database';
import Students from './students/Students';
import Teachers from './teachers/Teachers';
import Admins from './admins/Admins';
import Technicians from './technicians/Technicians';
import Login from '../user-authentication/login';

const UserPage = () => {
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

  //fetch-to dasboard
  const [registeredUser, setRegistered] = useState([]);
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

  return email ? (<>
    {registeredUser.map((data, index)=>(
      data.email ===  email ? (<>
      <div key={index}>
        {data.role === 'Admin' ? (<>
          <Admins />
        </>):(<></>)} 
        {data.role === 'Faculty' ? (<>
          <Teachers />
        </>):(<></>)}  
        {data.role === 'Technician' ? (<>
          <Technicians />
        </>):(<></>)}  
        {data.role === 'Student' ? (<>
          <Students />
        </>):(<></>)}  
      </div>
      </>):(<></>)
    ))}
  </>) : <Login />
}

export default UserPage;
