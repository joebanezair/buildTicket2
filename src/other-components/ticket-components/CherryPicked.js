import React, { useEffect, useState } from "react";
import { database } from "../../firebase/firebase";
import { get, onValue, ref, remove } from "firebase/database";

const CherryPicked = () => {
    let count = 0;
    const [queueTickets, setQueue] = useState([]);
    const [assignees, setAssignees] = useState([]);
    
    // Fetch data from Firebase database
    const fetchData = () => {
      const assignedQueueRef = ref(database, 'CherryPicked');
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
    useEffect(() => {
      fetchData();
    }, []);
    
   

    const deleteCherry =(key)=>{
      const assignedQueueRef = ref(database, 'CherryPicked/'+key);
      remove(assignedQueueRef).then(()=>{alert('removed Cherry Picked: ' + key); fetchData();})
    }
  
    return (
      <>
        <div id="chID22">
          Cherry <span>{queueTickets.length}</span>
        </div>
        <div id='assignedcontainer'>
          {queueTickets.length > 0 ? (
              <>
                {queueTickets.map((assigned, index) => (
                  <div id='asscon003' key={index}>
                   <div id="tripple-top">
                    <div><span>{assigned.status}</span></div>
                    <div><span>{assigned.prioritylevel}</span></div>
                    <div><span>{assigned.date}-{assigned.time}</span></div>
                   </div>
                   <div id="double-tb">
                    <div><span >{assigned.owner}</span></div>
                    <div><span>{assigned.floor}</span></div>
                   </div>
                   <div>
                    <ul>
                      <li><div>Problem: {assigned.problem}</div></li>
                      <li><div>Role: {assigned.role}</div></li>
                      <li><div>Category: <span>{assigned.problemCategory}</span></div></li>
                      <li><div>Assigned by: <span>{assigned.assigned_by_admin}</span></div></li>
                    </ul>
                   </div>

                   <div id="buttonAquiredel">
                     <button onClick={()=>{ 
                       const key = assigned.keyID;
                       deleteCherry(key);
                      }}>Delete</button>
                   </div>
                  </div>
                ))}

              </>
            ) : (
              <div>
                Empty Queue
              </div>
            )}
        </div>
      </>
    );
  };

  export default CherryPicked;