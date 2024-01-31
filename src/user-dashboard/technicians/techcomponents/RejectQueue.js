import React, { useEffect, useState } from 'react'
import { onValue, ref } from 'firebase/database';
import Moderator from '../../../context/Moderator';
import { database } from '../../../firebase/firebase';

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
        <div id='rejectedTtle233'>My Rejected Queues</div>
        {rejected.map((data, indexter)=>(
         data.owner === email ? (<>
        <div id='keyOwnerRejected' key={indexter}>
          <div id='btnDataReject'>
            <button onClick={()=>{
                setData(indexter)
            }}>{data.name}</button>
          </div>
          
          {indexData === indexter ? <>
            <div id='posfloat334mdk'>
              <div>
                <div>Problem: {data.name}</div>
                <div>{data.role}: {data.owner}</div>
                <div>Priority: {data.priority}</div>
                <div>Category: {data.problemCategory}</div>
                <div>{data.time}-{data.date}</div>
                <div>Description: {data.description}</div>
                <div>Floor: {data.floor}</div>
                <div>Rejected By: <span id='rejector'>{data.rejected_by}</span></div>
              </div>
              <div id='btnDataReject'>
                {indexData === indexter ? <>
                  <button onClick={()=>{
                    setData(-1)
                  }}>Close</button>
                </>:<></>}
              </div>
            </div>
          </>:<></>}

          
        </div>
        </>):(<></>)
        ))}
    </div>
  </>)
}

export default RejectQueue