import React, { useEffect, useState } from 'react'
import { database } from '../../firebase/firebase';
import { onValue, ref } from 'firebase/database';
import Moderator from '../../context/Moderator';

const RejectQueue = () => {
    const {email} = Moderator();
    const [rejected, setusersAssigned] = useState([]); 
    const fetchedRejected = () => {
      const myreference = ref(database, 'RejectedQueue');
      onValue(myreference, (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val();
          const keyID = childSnapshot.key; // Get the Firebase key (keyID) for each item
          data.push({ ...user, keyID });
        });
        setusersAssigned(data);
      });
    };
    useEffect(() => {
      fetchedRejected();
    }, []);

    const [indexData, setData] = useState(-1)

  return (<>
    <div id='rejectedKey'>
        <div id='rejectedTtle'>Rejected {rejected.length}</div>
        {rejected.map((data, indexter)=>(
        data.rejected_by === email ? (<>
        <div id='keyOwnerRejected' key={indexter}>
          <div>{data.role}: {data.owner}</div>
          <div>{data.time}-{data.date}</div>
          <div id='btnDataReject'>
            <button onClick={()=>{
                setData(indexter)
            }}>Data</button>
            {indexData === indexter ? <>
              <button onClick={()=>{
                setData(-1)
              }}>Close</button>
            </>:<></>}
          </div>
          
          {indexData === indexter ? <>
            <div>
              <ul>
                <li> 
                <div>Problem: {data.name}</div>
                </li>
                <li>
                <div>Priority: {data.priority}</div>
                </li>
                <li>
                <div>Category: {data.problemCategory}</div>
                </li>
                <li>
                <div>Description: {data.description}</div>
                </li>
                <li>
                <div>Floor: {data.floor}</div>
                </li>
              </ul>
            </div>
          </>:<></>}

          <div>Rejected By: <span id='rejector'>{data.rejected_by}</span></div>
        </div>
        </>):(<></>)
        ))}
    </div>
  </>)
}

export default RejectQueue