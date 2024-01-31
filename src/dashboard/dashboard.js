import React, { useState } from 'react';
import Moderator from '../context/Moderator';
import { useEffect } from 'react';
import UserPage from '../user-dashboard/userPage';
import Logsign from '../user-authentication/logsign';

const Dashboard = () => {
  const {email} = Moderator()
  const [isUser, setIsUser] = useState(!!email);  
  useEffect(() => {
    if (email) {
      setIsUser(true);
    }
  }, [email]);
  return (
    <>
      {isUser ? (
        <UserPage />
      ) : (
        <Logsign />
      )}
    </>
  );
}

export default Dashboard;
