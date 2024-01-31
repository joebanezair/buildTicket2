import React, { useEffect, useState } from "react";
import { database } from "../../../firebase/firebase";
import { onValue, ref, get, set, push } from "firebase/database"; 
import Moderator from "../../../context/Moderator";

const AssignedQueue = () => {
    let count = 0;
    const {email} = Moderator();
    const [queueTickets, setQueue] = useState([]);    
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
  
    return (
      <>
        <div>
          Total: {queueTickets.length}
        </div>
        <div id='assignedcontainer'>
          {queueTickets.length > 0 ? (
              <>
                {queueTickets.map((assigned, index) => (
                  <div id='asscon003' key={index}>
                      <div id='ass0202flex'>
                        <div id='ass002owner'>
                          <span id='underlineTitle'>{assigned.role}: {assigned.problem}</span>
                        </div>
                        <div id='ass002owner'>
                          <span>Category: {assigned.problemCategory}</span>
                        </div>
                        <div id='ass002owner'>
                          <span>Priority level: {assigned.prioritylevel}</span>
                        </div>
                      </div> 
                  
                      <div>
                        <div id="progholderassignedmain">
                          <div id='divID'><span>{assigned.status}</span></div>
                        </div>
                        <div>
                          {queueStatus.map((statusArray, index) => {
                           const filteredStatusArray = statusArray.filter(status => status.keyID === assigned.keyID);
                            if (filteredStatusArray.length > 0) {
                              return (
                              <div id="progholderassignedmain" key={index}>
                                {filteredStatusArray.map((status, subIndex) => (
                                 <div id="progholderassigned" key={subIndex}>
                                   <div>{status.StatusProgress}</div>
                                   <div>{status.technician}</div>
                                 </div>))}
                              </div>);}
                              return null;  
                           })}
                        </div>
                      </div>
                      
                      <div id='ass0202flex'>
                        <div id='ass002owner'>
                          <span >{assigned.owner}</span>
                        </div>
                        <div id='ass002owner'>
                          <span>{assigned.date}-{assigned.time}</span>
                        </div>
                        <div id='ass002owner'>
                          <span>{assigned.floor}</span>
                        </div>
                        <div id='ass002owner'>
                          <span id="commentbtnview" onClick={()=> {setCommentI44(index); commentIndexter(assigned.keyID);}}>{'live comments'}</span>
                        </div>

                        {commentIndex === index ? (<>
                          <div id='ass002owner'>
                            <span id="commentbtnview" onClick={closecommentID}>close</span>
                          </div>

                          <div id='ass002owner'>
                            <span id="commentbtnview" onClick={()=> {clearComment(assigned.keyID); commentIndexter(assigned.keyID)}}>clear comments</span>
                          </div>
                        </>) : (<> </>)}
                      </div>
                      {commentIndex === index ? (<>
                        <div id="commentcontainer">
                          <div id="commentassined">
                            <div id="comment-flex">
                              <div>
                              <textarea
                                id="comment"
                                name="comment"
                                placeholder="Add your comment here"
                                value={comment}
                                onChange={(event) => handleCommentChange(event.target.value)}
                              />
                              </div>
                              <div>
                                <div>
                                 <span id="commentbtn444" onClick={() => {commentID(index); commentIndexter(assigned.keyID)}}> comment</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div id="comtitle">comments: {liveChat.length}</div>
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
                              </>):(<>no comments yet</>)}
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