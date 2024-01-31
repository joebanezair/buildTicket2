import React, { useEffect, useState } from 'react';
import Moderator from '../../context/Moderator';
import AdminNormalTicket from './components/AdminNormalTicket';
import AssignedQueue from './components/AssignedQueue';
import CherryPicked from '../../other-components/ticket-components/CherryPicked';
import Inque from '../../other-components/ticket-components/Inque';
import RejectQueue from '../../other-components/ticket-components/RejectQueue';
import { database } from '../../firebase/firebase';
import { onValue, ref } from 'firebase/database';
import AdminKPI from './components/AdminKPI';
import AdminMonitoring from './AdminMonitoring';

const AdminTicketProcess = () => {
  const { email } = Moderator();
  const [category004, setcategory004] = useState('Default')
  const btnAssigned = ()=>{
    setcategory004('Assigned')
  }

  //
  const [queueTickets, setQueue] = useState([]);    
  useEffect(() => {
    const fetchData = () => {
      const assignedQueueRef = ref(database, 'AssignedQueue'); 
      onValue(assignedQueueRef, (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val();
          const keyID = childSnapshot.key;
          data.push({ ...user, keyID });
        });
        setQueue(data);
      });
    };
    
    fetchData();
  }, []);
  //
  return (
    <>
     <div id='paddingtop' />
     <div id='displayCategories'>
        <div>
          <button onClick={btnAssigned}>Assigned <span id='crimson'>{queueTickets.length}</span></button>
          <button onClick={()=>{setcategory004('My Queue')}}>My Queue</button>
          <button onClick={()=>{setcategory004('Rejected')}}>Rejected</button>
          <button onClick={()=>{setcategory004('Default')}}>Create Ticket</button>
          <button onClick={()=>{setcategory004('Cherry Picked')}}>Cherry Picked</button>
          <button onClick={()=>{setcategory004('KPI')}}>KPI</button>
          <button onClick={()=>{setcategory004('Profile')}}>Profile</button>
        </div>
        <div id='displayCategories0045'>
        
          {category004 === 'Assigned' ? (
                <>
                 <AssignedQueue/>
                </>
            ) : category004 === 'My Queue' ? (
                <>
                 <div id='MyQueue22'>
                  <Inque />
                 </div>
                </>
            ) : category004 === 'KPI' ? (
              <>
               <div>
                 <AdminKPI />
               </div>
              </>
            ) : category004 === 'Profile' ? (
              <>
               <div>
                 <AdminMonitoring />
               </div>
              </>
            ) : category004 === 'Rejected' ? (
              <>
                <RejectQueue/>
              </>
            ) : category004 === 'Default' ? (
              <>
               <div id='default44'>
                <AdminNormalTicket />
               </div>
              </>
            ) : category004 === 'Cherry Picked' && (
              <>
               <div>
                <CherryPicked />
               </div>
              </>
            )}

        </div>
     </div>
    </>
  );
};

export default AdminTicketProcess;


