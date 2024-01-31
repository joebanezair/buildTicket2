import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { database } from '../../firebase/firebase';
import InqueDouble from './InqueDouble';
import Aquired from './Aquired';
import Moderator from '../../context/Moderator';
import InqueFeedback from './InqueFeedback';
import InqueProgress, { SendResolution, SendResolved } from './InqueProgress';

const GeneralTickets = () => {
  const {email} = Moderator();
  //inqueue
  const [queueTickets, setQueue] = useState([]); 
  const [oldqueue, setoldqueue] = useState([]);
  const fetchData = () => {
    const myreference = ref(database, 'InqueTickets');
     onValue(myreference, (snapshot) => {
     const data = [];
     snapshot.forEach((childSnapshot) => {
       const user = childSnapshot.val();
       const keyID = childSnapshot.key; // Get the Firebase key (keyID) for each item
       data.push({ ...user, 
        keyID: keyID, 
      });
     });
      setQueue(data);
      setoldqueue(data);
     });
  };
  //inqueue

  useEffect(() => {
    fetchData();
  }, []);

  return (<>
    <div id='flex801Gen'>
      <div id='flex80Gen'>
        <div id='flex80Gendiv1'>
          <div id='flex80Content'>
            <Aquired />
          </div>
        </div>
        <div id='flex80Gendiv2'>
          <div id='flex80Content'>
            <div id='flexProgress2223'>
              <InqueDouble />
            </div>
            <div id='flexProgress222'>
              <div id='flexProgress2223'>
                <InqueFeedback />
              </div>
              <div id='flexProgress2223'>
                <InqueProgress />
              </div>
              <div id='flexProgress2223'>
                <SendResolution />
              </div>
              <div id='flexProgress2223'>
                <SendResolved />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default GeneralTickets