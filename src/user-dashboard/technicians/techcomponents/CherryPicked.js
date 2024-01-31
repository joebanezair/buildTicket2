import React, { useEffect, useState } from "react";
import {remove, get, onValue, ref, set } from "firebase/database";
import { database } from "../../../firebase/firebase";
import Moderator from "../../../context/Moderator";

const CherryPicked = () => {
    const [queueTickets, setQueue] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const {email} = Moderator();
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
    

    const AquireData =(MyData)=>{
        const ReferenceAcquired = ref(database, `AquiredCherry/${MyData.IDKey}`); 
        const assignedQueueRef = ref(database, 'CherryPicked/'+MyData.IDKey);   
        set(ReferenceAcquired, MyData).then(()=>{
          remove(assignedQueueRef).then(()=>{alert('Aquired: ' + MyData.Problem); fetchData();})
        })
        console.log(MyData)
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
                   <div id="doubleidlssd">
                    <ul>
                      <li><div>Problem: {assigned.problem}</div></li>
                      <li><div>Role: {assigned.role}</div></li>
                      <li><div>Category: <span>{assigned.problemCategory}</span></div></li>
                    </ul>
                   </div>

                   <div id="buttonAquire">
                     <button onClick={()=>{
                        const status = assigned.status;
                        const priority = assigned.prioritylevel;
                        const owner = assigned.owner;
                        const floor = assigned.floor;
                        const problem = assigned.problem;
                        const role = assigned.role;
                        const category = assigned.problemCategory;
                        const kID = assigned.keyID;
                        const currentDate = new Date();
                        const myData = {
                          Status: status,
                          Priority: priority,
                          Owner: owner,
                          Floor: floor,
                          Problem: problem,
                          Role: role,
                          Category: category,
                          IDKey: kID,
                          AquiredBy: email,
                          Feedback: '',
                          Rating: '',
                          Progress: '',
                          Day: currentDate.getDate(), 
                          Month: currentDate.getMonth() + 1,  
                          Year: currentDate.getFullYear(),  
                          Time: currentDate.toLocaleTimeString(),
                        };
                        AquireData(myData)
                     }}>Acquire</button>
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


  const AquiredTickets =()=>{
    const [queueTickets, setQueue] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const fetchAquire = () => {
      const assignedQueueRef = ref(database, 'AquiredCherry');
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
      fetchAquire();
    }, []);

    return(<>
        <div id="chID22">
          Cherry <span>{queueTickets.length}</span>
        </div>
        <div id='assignedcontainer'>
          {queueTickets.length > 0 ? (
              <>
                {queueTickets.map((acq, index) => (
                  <div id='asscon003' key={index}>
                   <div id="tripple-top">
                    <div><span>{acq.Status}</span></div>
                    {/* <div><span>{assigned.prioritylevel}</span></div>
                    <div><span>{assigned.date}-{assigned.time}</span></div> */}
                   </div>
                   <div id="double-tb">
                    {/* <div><span >{assigned.owner}</span></div>
                    <div><span>{assigned.floor}</span></div> */}
                   </div>
                   <div id="doubleidlssd">
                    <ul>
                      {/* <li><div>Problem: {assigned.problem}</div></li>
                      <li><div>Role: {assigned.role}</div></li>
                      <li><div>Category: <span>{assigned.problemCategory}</span></div></li> */}
                    </ul>
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
    </>)
  }

  export default CherryPicked;
  export {AquiredTickets}