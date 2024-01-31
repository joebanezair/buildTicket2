import React, { useEffect, useState } from 'react';
import 'firebase/database';
import { database } from '../../../firebase/firebase';
import { onValue, push, ref, set, update } from 'firebase/database';
import Moderator from '../../../context/Moderator';

const RequestKPI = () => {
  const { email } = Moderator();
  const [queueStatus, setQueueStatus] = useState([]);
  const [oldqueueStatus, oldsetQueueStatus] = useState([]);

  useEffect(() => {
    const dbRef = ref(database, 'AssignedQueueStatus');
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const queueStatusArray = Object.values(data);
        setQueueStatus(queueStatusArray);
        oldsetQueueStatus(queueStatusArray)
      }
    });
  }, []);

  //dapat hindi sya sa queueStatus mag use Effect ka ng bago
  //para hndi sya naulit
 const handleUpdateStatus = (keyID, newStatus) => {
    const updatedQueueStatus = {};
  
    queueStatus.forEach((statusGroup, index) => {
      statusGroup.forEach((status) => {
        if (status.keyID === keyID && status.technician === email) {
          status.StatusProgress = newStatus;
          updatedQueueStatus[`AssignedQueueStatus/${keyID}/${index}`] = status;
        }
      });
    });
  
    update(ref(database), updatedQueueStatus)
      .then(() => {
        console.log('Update successful');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  
    setQueueStatus(updatedQueueStatus);
  };
  
  
 
  //requestAssign
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
  
  const [mifune, setmifune] = useState(-1);
  const opendatainDex=(index)=>{
    setmifune(index)
  }
  const closedatainDex =()=>{
    setmifune(-1)
  }

  //live comments
  const [comment, setComment] = useState('');
  const [commentIndex, setcommentIndex] = useState(-1);
  const setCommentI44=(index)=>{
    setcommentIndex(index);
  }
  const handleCommentChange = (newComment) => {
    setComment(newComment);
  };
  const closecommentID =()=>{
    setcommentIndex(-1);
  }
  const commentID =(index)=>{
    const queID = queueTickets[index].keyID;
    const referenceQueue = ref(database, `${queueTickets[index].keyID}/`);
    const commentpushed = push(referenceQueue); 
    const commentData = {
      userComment: comment,
      userEmail: email,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    set(commentpushed, commentData).then(() => {
      console.log(`Item saved: ${queID}`);
      setComment('');
    })
    .catch((err) => console.log(err.message));
  }
  const [liveChat, setChat] = useState([]);   
  const commentIndexter = (index) => {
    const chatData = ref(database, `${index}`);
    const data = [];
    console.log(index); 
    onValue(chatData, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const users = childSnapshot.val();
        const keyID = childSnapshot.key;
        data.push({
          ...users,
          keyID
        });
      });
      setChat(data); // Update the 'confirmUsers' state
    });
    //
  };
  //live comments

  //resolution
  const [resolution, setresolution] = useState('');
  const handleResolutionChange =(e)=>{
    setresolution(e);
  }
  const sendResolution =(index)=>{
    const myResolution = queueStatus[index];
    const myResolution1 = queueTickets[index];
    const data = [];
    myResolution.map((qData) => {
      if (qData.technician === email) { // Changed 'qdata' to 'qData'
        data.push(qData);
      }
    });
   const progress = data.map((item) => item.StatusProgress);
   const progresstring = progress.join(', '); 
   const filterResolution = {
    Resolution: resolution,
    KPI_Owner: email,
    Ticket_Status: progresstring,
    Resolution_Status: 'Pending',
    Rating: '0',
    Ticket_Owner: myResolution1.owner, 
    KeyID: myResolution1.keyID,
    Problem:  myResolution1.problem,
    Category: myResolution1.problemCategory,
    Role: myResolution1.role,
    Level: myResolution1.prioritylevel,
    Floor: myResolution1.floor,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
   }
   const slicedEmail = email.slice(0, 6);
   const resolutionRef = ref(database, `Resolution/${slicedEmail}${myResolution1.keyID}`);
   set(resolutionRef, filterResolution).then(()=>{
    console.log(`Data Saved`)
   }).catch((err)=>{
    alert(`error : `, err.message)
   })
  }

 
  //read
  const [reso2, setreso2] = useState([]);  
  useEffect(() => {
    const fetchData = () => {
      const assignedQueueRef = ref(database, 'Resolution');
      onValue(assignedQueueRef, (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val();
          const keyID = childSnapshot.key;
          data.push({ ...user, keyID });
        });
        setreso2(data);
      });
    };
    fetchData();
  }, []);

  const saveIndex =(index)=>{
    const data = reso2[index];
    console.log(data)
    const resolutionRef = ref(database, `Resolved/${data.keyID}`);
    set(resolutionRef, data).then(()=>{
      alert(`Data Saved`)
    }).catch((err)=>{
      alert(`error : `, err.message)
    })
  }

  const [openreso, setopenreso] = useState(-1);
  const openResution=(index)=>{
    setopenreso(index);
  }
  const closeReso =()=>{
    setopenreso(-1);
  }
  //resolution
  return (
    <div>
      <div id='qtitle22323'>Assigned to me: </div>
      {queueStatus.map((statusGroup, index) => (
              <div id='queueStatsTechni' key={index}>
                {statusGroup.map((status, subIndex) =>
                  status.technician === email ? (
                    <div key={subIndex}>
                      <div id='viewmifunedata'>
                        <button onClick={()=>{opendatainDex(index); commentIndexter(status.keyID);}}>Data</button>
                        {mifune === index ? (<>
                          <button onClick={()=>{closedatainDex()}}>Close</button>
                        </>):(<></>)}

                        <button onClick={()=>{setCommentI44(index)}}>Live Comments</button>
                        {commentIndex === index ? (<>
                          <button onClick={()=> closecommentID()}>Close</button>
                        </>):(<></>)}

                        <div id='bottomtechflex'>
                          {queueTickets.map((qdata, indx)=>
                            qdata.keyID === status.keyID ? (<div id='dataTechQueue1' key={indx}>
                            {qdata.role === 'Admin' ? (<>
                              <button id='tAdmn'>{qdata.role} {qdata.prioritylevel} :</button>
                            </>):(<></>)}  
                            {qdata.role === 'Faculty' ? (<>
                              <button id='tFac'>{qdata.role} {qdata.prioritylevel} :</button>
                            </>):(<></>)}  
                            {qdata.role === 'Student' ? (<>
                              <button  id='tStu'>{qdata.role} {qdata.prioritylevel} :</button>
                            </>):(<></>)}  
                          </div>) : (<></>))}
                          <div>
                            <div id='selectTechprogress'>
                                <select
                                value={status.StatusProgress}
                                id={`statusSelect-${status.keyID}`}
                                onChange={(e) =>
                                    handleUpdateStatus(status.keyID, e.target.value)
                                }>
                                <option value="In Progress">In-Progress</option>
                                <option value="Acknowledge">Acknowledged</option>
                                <option value="Done">Done</option>
                                </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {mifune === index ? (<>
                          {queueTickets.map((qdata, indx)=>
                            qdata.keyID === status.keyID ? (<div id='dataTechQueue' key={indx}>
                            <div id='gcsgt'>Title: <span>{qdata.problem}</span></div>  
                            <div id='gcsg'>{qdata.time} {qdata.date}</div>  
                            <div>Category: <span>{qdata.problemCategory}</span></div>  
                          <div><span>Description: </span>
                        {qdata.problemdescription}</div> 
                      </div>) : (<></>))}</>):(<></>)}
                      
                      {commentIndex === index ? (<>
                      <div>
                          <div id="cmtTechni">
                            <div>
                              <textarea id="cmtTech" name="comment" placeholder="Comment here" value={comment} onChange={(event) => handleCommentChange(event.target.value)} />
                            </div>
                            <div>
                              <div><span id="commentbtn4442" onClick={() => {commentID(index); commentIndexter(status.keyID)}}> comment</span></div>
                            </div>
                          </div>
                          <div>
                          <div id="comtitle">comments: {liveChat.length}</div>
                          <div id="cmtTechniCon3">
                            <div id="cmtTechniCon34">
                              {liveChat.length > 0 ? (<>
                              {liveChat.map((chat, index)=>{return( <div key={index}>
                              <div id="commentIDContainerLive">
                              <div id="commentemail">{chat.userEmail} - {chat.date} - {chat.time}</div>
                              <div id="commentmetadata">
                              <div>{chat.userComment}</div>
                              </div>
                              </div>
                              </div>)})}
                              </>):(<>no comments yet</>)}   
                            </div>   
                          </div>
                        </div>
                        </div>
                      </>):(<></>)}
                    
                    {status.StatusProgress === 'Done' ? (<>
                      <div id='sendreso'>
                        <button onClick={()=>{openResution(index)}}>Send Resolution</button>
                        {openreso === index ? (<>
                        <button onClick={closeReso}>Close</button>
                        </>):(<></>)}
                      </div>
                      <div id='resolutionfeedback'>
                        <div>
                          
                          {openreso === index ? (<>
                            <textarea
                            name="resolution"
                            placeholder="My Resolution"
                            value={resolution}
                            onChange={(e)=>{handleResolutionChange(e.target.value)}}
                            />
                              <button onClick={() => {sendResolution(index);}}>Submit</button>
                          </>):(<></>)} 

                          <div id='resolution12'>
                            {reso2.map((reso, inx) => (
                              reso.KeyID === status.keyID ? (
                                <div id='reflexs3' key={inx}>
                                <div>Ticket Status: {reso.Resolution_Status}</div>
                                <div>Rating: {reso.Rating}</div>
                                </div>
                              ) : (<></>)
                            ))}
                            {reso2.map((reso, inx) => (
                              reso.KeyID === status.keyID ? (
                                <div key={inx}>
                                <div id='resocontento'>
                                  <div>Resolution: {reso.Resolution}</div>
                                </div>
                                <div id='resocontento2'>
                                  <button onClick={()=>{saveIndex(index)}}>save</button>
                                </div>
                                </div>
                              ) : (<></>)
                            ))}
                          </div>
                          
                        </div>
                        <div></div>
                      </div>
                    </>):(<></>)}
                    </div>
                  ) : null
                )}
              </div>
            ))}
    </div>
  );
};

export default RequestKPI;


