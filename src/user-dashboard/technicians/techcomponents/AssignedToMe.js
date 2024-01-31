import React, { useEffect, useState } from 'react'
import { AiTwotoneStar, AiFillApi, AiTwotoneMessage } from "react-icons/ai";
import { RiSendPlane2Fill, RiChatFollowUpFill } from "react-icons/ri";
import { database } from '../../../firebase/firebase';
import { onValue, push, ref, set, update } from 'firebase/database';
import Moderator from '../../../context/Moderator';

const AssignedToMe = () => {
  const {email} = Moderator();
  //
  const [queueTicketsAssignedTome, setQueue] = useState([]);    
  const fetchDataAssignedTome = () => {
    const assignedQueueRef = ref(database, 'TechniciansAssigned'); 
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
    fetchDataAssignedTome();
  }, []);
  //


   //
   const [reso44, setreso44] = useState([]);    
   const resolutionF = () => {
     const assignedQueueRef = ref(database, 'Resolution'); 
     onValue(assignedQueueRef, (snapshot) => {
       const data = [];
       snapshot.forEach((childSnapshot) => {
         const user = childSnapshot.val();
         const keyID = childSnapshot.key;
         data.push({ ...user, keyID });
       });
       setreso44(data);
     });
   };
   useEffect(() => { 
    resolutionF();
   }, []);
   //

  //
  const [queueTicketsAssigned, setQueueAssigned] = useState([]);    
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
        setQueueAssigned(data);
      });
    };
    fetchData();
  }, []);
  //
  const [open, close] = useState(-1);
  const [status, setStatus] = useState('Queued');
  const statusOptions = ['Queued', 'Acknowledged', 'In Progress', 'Done'];
  
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  //removable update
  const updateDataInDatabase = (keyID, newData) => {
    const assignedQueueRef = ref(database, `TechniciansAssigned/${keyID}`);
    update(assignedQueueRef, newData)
      .then(() => { 
        alert('Data updated successfully');
      })
      .catch((error) => {
        console.error('Error updating data: ', error);
      });
  };
  const handleUpdateData = (statusQueue, key) => {
    const newData = {
      TicketStatus: statusQueue,
    };
    updateDataInDatabase(key, newData);
  };
  //removable update
  const [resolution, setresolution] = useState(`I have already solved the ticket`);
  const [btnresolution, btnsetresolution] = useState(-1);
  const [progress, setprogress] = useState(-1);
  const handleResolution = (event) => {
    const targetValue = event.target.value;
    setresolution(targetValue);
  };
  const saveResolution = (resolutionKey, ticketID, technician, keyData, admin, mowner) =>{
    const referenceResolution = ref(database, 'Resolution/'+ticketID); 
    const queData = {
      Technician: technician,
      TicketKeyID: keyData,
      Resolution: resolutionKey,
      Rating: '0',
      TicketAdmin: admin,
      Feedback: "",
      TicketOwner: mowner,
    }
    set(referenceResolution, queData).then(()=>{
      alert('saved');
    })
    setresolution('')
  }

  //
  //removable comment
  const [comment, setComment] = useState('');
  const handleCommentChange = (newComment) => {
    setComment(newComment);
  };
  //readWriteComment magkaiba yung accuracy ng index ng addmin sa Technician
  const commentID =(index)=>{
    const referenceQueue = ref(database, `${index}/`);
    const commentpushed = push(referenceQueue);
    const commentData = {
      userComment: comment,
      userEmail: email,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    set(commentpushed, commentData).then(() => {
      console.log(`Item saved: ${index}`);
      setComment('');
    })
    .catch((err) => console.log(err.message));
  }
  //removable comment

  const [openC, setC] = useState(-1);
  const openComment =(index)=>{
    setC(index)
  }
  const closeComment =()=>{
    setC(-1)
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
  };
  //

  return (<>
    <div id='assmetech23'>
      {queueTicketsAssignedTome.map((assme, dindex)=>(
        assme.assignedEmpEm === email ? (<>
          <div id='containerassme' key={dindex}>
            {queueTicketsAssigned.map((asData, asIndex) => (
               asData.keyID === assme.ticketID ? (<>
               <div id='assmeMetaData'>
                <div>{asData.role} : {asData.problem}</div>
                <div>ID: {asData.keyID}</div>
                <div>Progress : {assme.TicketStatus}</div>
                <div id='astechbtncon333'>
                  <button onClick={()=>{
                    close(dindex)
                  }}>Data</button>
                  {open === dindex ? (<>
                   <button onClick={()=>{
                    close(-1)
                   }}>Close</button>
                  </>):(<></>)}

                  <button onClick={()=>{
                    const progresscheck = reso44.some((data) => asData.keyID === data.TicketKeyID && data.Technician === email)
                    if(progresscheck){
                      alert('cannot set progress  because it already have resolution')
                    }else{
                      setprogress(dindex);
                    }
                  }}>Progress</button>
                  {progress === dindex ? (<>
                    <button onClick={()=>{
                    setprogress(-1);
                  }}>Close</button>
                  </>):(<></>)}
                </div>
               </div>
               {open === dindex ? (<>
                <div id='assmeMetaData2' key={asIndex}>
                  <ul>
                    <li>Category: {asData.problemCategory}</li>
                    <li>Priority: {asData.prioritylevel}</li>
                    <li>Ticket ID: {assme.ticketID}</li>
                    <li>Description: {asData.problemdescription}</li>
                  </ul>
                </div>
               </>):(<></>)}
                {progress === dindex ? (<>
                  <div id='statusTech444'>
                    <div>
                      <select name="status" value={status} onChange={handleStatusChange}>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}> {option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <button onClick={()=>{
                        const statusQueue = status;
                        const key = assme.keyID;
                        handleUpdateData(statusQueue, key);
                      }}>Set Progress</button>
                    </div>
                  </div>
                </>):(<></>)}

                {assme.TicketStatus === 'Done' ? (<>
                  <div id='resolutioncontaineere'>
                    <button onClick={()=>{
                      btnsetresolution(dindex)
                    }}>Send resolution</button>
                    {btnresolution === dindex ? (<>
                      <button onClick={()=>{
                        btnsetresolution(-1)
                      }}>Close</button>
                    </>):(<></>)}
                  </div>
                  {btnresolution === dindex ? (<>
                    <div id='resolution33container'>
                      <div>
                        <textarea
                          placeholder={`Resolution`}
                          id='resolution'
                          name='description'
                          value={resolution}
                          onChange={handleResolution}
                        />
                      </div>
                      <div>
                        <button onClick={()=>{
                          const ticketID = assme.keyID;
                          const keyData = asData.keyID;
                          const technician = assme.assignedEmpEm;
                          const mdmin = asData.assigned_by_admin;
                          const mowner = asData.owner;
                          saveResolution(resolution, ticketID, technician, keyData, mdmin, mowner);
                        }}>Send</button>
                      </div>
                    </div>
                  </>):(<></>)}
                </>):(<></>)} 

                {reso44.map((resData, resIndex)=>(
                  asData.keyID === resData.TicketKeyID ? (<>
                  <div id='reso33224344' key={resIndex}>
                    <div>
                      <div id='resoflexs333'>
                        <div>
                          <AiFillApi />
                        </div>
                        <div>
                        {resData.Resolution}
                        </div>
                       </div>
                      <div id='resoflexs333'>
                        <div>
                          <AiTwotoneStar />
                        </div>
                        <div>{resData.Rating}</div>
                      </div>
                    </div>
                  </div>
                  </>):(<></>)
                ))}

                <div id='dllchats'>
                  <button onClick={()=>{commentIndexter(asData.keyID); openComment( asData.keyID)}}>Live Chats</button>
                </div>
                  
                  {openC === asData.keyID ? (<>
                   <div id='clschatmodale'>
                    <div>
                      <div id='btnclos343433'>
                       <button>{asData.role} : {asData.problem}</button>
                      </div>

                      <div id="techAdd8383">
                        <div id='btnclos3434'>
                         <button onClick={()=>{commentIndexter(asData.keyID); closeComment()}}>Close</button>
                        </div>
                        <div>
                          <input
                            type='text'
                            id="comment"
                            name="comment"
                            placeholder="Live Chat..."
                            value={comment}
                            onChange={(event) => handleCommentChange(event.target.value)}/>
                          </div>
                          <div>
                          <button id="" onClick={() => {
                            const  keyIDIndexter = asData.keyID
                            commentID(keyIDIndexter); 
                            commentIndexter(asData.keyID)}}> 
                              <RiSendPlane2Fill />
                            </button>   
                          </div>
                        </div> 
                    </div>      
                    <div>
                        <div id="comtitle">Chats {liveChat.length}</div>
                          <div id="commentcontainer1">
                            {liveChat.length > 0 ? (<>
                            {liveChat.map((chat, index)=>{
                              return( <div key={index}>
                                  <div id="commentIDContainerLive">
                                  <div id="commentemail">{chat.userEmail} - {chat.date} - {chat.time}</div>
                                  <div id="commentmetadata">
                                  <div>{chat.userComment}</div>
                                  </div>
                                  </div>
                                  </div>)
                              })}
                          </>):(<>no chats yet</>)}
                        </div>
                    </div>
                   </div>
                  </>):(<></>)}

             </>):(<></>)
            ))}
          </div>
        </>):(<></>)
      ))}
    </div>
  </>)
}

export default AssignedToMe