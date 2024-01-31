import React, { useEffect, useState } from "react";
import { database } from "../../../firebase/firebase";
import { onValue, ref, get, set, push } from "firebase/database"; 
import Moderator from "../../../context/Moderator";
import { VscBriefcase, VscDebugContinue, VscBookmark, VscTrash, VscArrowCircleLeft, VscVerifiedFilled } from "react-icons/vsc";
const AssignedQueue = () => {
    let count = 0;
    const {email} = Moderator();
    const [queueTickets, setQueue] = useState([]);   
    const [loadPrevious, setLoadPrevious] = useState([]); 
    // Fetch data from Firebase database
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
          setLoadPrevious(data)
        });
      };
      
      fetchData();
    }, []);
   
    const [queueStatus, setQueueStatus] = useState([]);
    useEffect(() => {
      const assignedQueueRef = ref(database, 'AssignedQueueStatus');
      const fetchData = async () => {
        try {
          const snapshot = await get(assignedQueueRef);
          const data = snapshot.val();
          if (data) {
            const queueStatusArray = Object.values(data);
            setQueueStatus(queueStatusArray);
          } else {
            setQueueStatus([]);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, []);
    //

    //removable
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
    //readWriteComment
    const commentID =(index)=>{
      const queID = queueTickets[index].keyID;
      // const referenceQueue = ref(database, `CommentAssigned/${queueTickets[index].keyID}/`);
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

    //ni reload koto to delete>post>update data para smooth
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

    const clearComment = (index) => {
      const deleteReference = ref(database, `${index}`);
      set(deleteReference, null)
        .then(() => {
          console.log('Comment deleted');
        })
        .catch((error) => {
          console.log('no to delete: ' + error.message);
        });
    }

    //
    const [usersAssigned, setusersAssigned] = useState([]);
    const fetchDataAssigned = () => {
      const myreference = ref(database, 'TechniciansAssigned');
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
      fetchDataAssigned();
    }, []);
    //

     //removable
     const [searchQueue, setSearchQueue] = useState('');
     const handleSearchQue = (activeSearchText) => {
       if (activeSearchText.trim() === '') {
         setQueue(loadPrevious);
       } else {
         const filteredQueue = queueTickets.filter(item =>
           item.problem.toLowerCase().includes(activeSearchText.toLowerCase())||
           item.role.toLowerCase().includes(activeSearchText.toLowerCase())||
           item.problemCategory.toLowerCase().includes(activeSearchText.toLowerCase())||
           item.prioritylevel.toLowerCase().includes(activeSearchText.toLowerCase())
         );
         setQueue(filteredQueue);
       }
     };
 
     const handleSearchQueue = (event) => {
       const activeQueueUsers = event.target.value;
       setSearchQueue(activeQueueUsers);
       handleSearchQue(activeQueueUsers);
     };
     //removable
  
    return (
      <>
        <div id="Asflex3">
          <div id='searchflex'>
            <div id="">
              <input
              type="search"
              placeholder='Search Queue'
              value={searchQueue}
              onChange={handleSearchQueue}/>
            </div>
          </div>
          <div id="assignedID232">
            Assigned {queueTickets.length}
          </div>
        </div>

        <div id='assignedcontainer'>
          {queueTickets.length > 0 ? (
              <>
                {queueTickets.map((assigned, index) => (
                  <div id='asscon003' key={index}>
                      <div id='ass0202flex'>
                        <div id='ass002owner111'>
                          <span id='underlineTitle'>{assigned.status} {assigned.role}: {assigned.problem}</span>
                        </div>
                        <div id='ass002owner11'>
                          <span>Category: {assigned.problemCategory}</span>
                        </div>
                        <div id='ass002owner11'>
                          <span>Priority level: {assigned.prioritylevel}</span>
                        </div>
                      </div> 
                
                      <div id='ass0202flexc'>
                        <div id='ass002owner11'>
                          <span >{assigned.owner}</span>
                        </div>
                        <div id='ass002owner11'>
                          <span>{assigned.floor}</span>
                        </div>
                        <div id='ass002owner11'>
                          <span>{assigned.date}-{assigned.time}</span>
                        </div>
                        
                      </div>

                      <div id='flexass002owner'>
                        <div id="commentbtnview" onClick={()=> {setCommentI44(index); commentIndexter(assigned.keyID);}}>
                          <div><VscBookmark/></div>
                          <div>Chat</div>
                        </div>
                      </div>

                      <div id="hshshs">
                        {usersAssigned.map((assData, i)=>(
                          assData.ticketID === assigned.keyID ? (<>
                          <div id="flexassigned23232" key={i}>
                            <div>
                              <VscVerifiedFilled />
                            </div>
                            <div><span>{assData.assignedEmpEm}</span></div>
                            <div id="queAss3232"><span>{assData.TicketStatus}</span></div>
                          </div>
                          </>) : (<></>) 
                        ))}
                      </div>
                      {commentIndex === index ? (<>
                       <div id="dksmsej">
                          <div id="dvie33">{assigned.status} {assigned.role} : {assigned.problem}</div>
                           <div id="commentcontainerAdmin">
                             <div id="commentassinedAdmin">
                              <div id="comment-flex">
                                <div id="commentbtn444sas7">
                                  <input type="text"
                                    id="comment"
                                    name="comment"
                                    placeholder="Live Chat..."
                                    value={comment}
                                    onChange={(event) => handleCommentChange(event.target.value)}
                                  />
                                  <button  onClick={() => {commentID(index); commentIndexter(assigned.keyID)}}> Chat</button>
                                </div>
                              </div>
                            </div>

                            <div  id='flexass002owner1'>
                              <button id="commentbtnview" onClick={closecommentID}>
                                Close
                              </button>
                              <button id="commentbtnview" onClick={()=> {clearComment(assigned.keyID); commentIndexter(assigned.keyID)}}>
                                Delete
                              </button>
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
                              </>):(<>no chats yet...</>)}
                            </div>
                          </div>
                        </div>
                       </div>
                      </>):(<></>)}
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

  export default AssignedQueue;