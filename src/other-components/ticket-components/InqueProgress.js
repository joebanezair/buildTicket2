import { TfiCommentAlt } from "react-icons/tfi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { CgComment } from "react-icons/cg";
import React, { useEffect, useState } from 'react';
import Moderator from '../../context/Moderator';
import { database } from '../../firebase/firebase';
import { onValue, push, ref, remove, set, update } from 'firebase/database';

const InqueProgress = () => {
  const { email } = Moderator();
  const [aquired, setAquired] = useState([]);
  const [oldqueue1, setOldQueue1] = useState([]);

  const fetchData2 = () => {
    const myReference = ref(database, 'AquiredTickets');
    onValue(myReference, (snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        const keyID = childSnapshot.key;
        data.push({
          ...user,
          keyID: keyID,
        });
      });
      setAquired(data);
      setOldQueue1(data);
    });
  };

  useEffect(() => {
    fetchData2();
  }, []);

  const filteredAcqs = aquired.filter((data) => data.AquiredBy === email);

  const [searchText, setSearchText] = useState('');

  const handleSearch = (activeSearchText) => {
    if (activeSearchText.trim() === '') {
      setAquired(oldqueue1);
    } else {
      const filteredUsers = aquired.filter(
        (user) =>
          user.Name.toLowerCase().includes(activeSearchText.toLowerCase()) ||
          user.Category.toLowerCase().includes(activeSearchText.toLowerCase()) ||
          user.Priority.toLowerCase().includes(activeSearchText.toLowerCase())
      );
      setAquired(filteredUsers);
    }
  };
  const handleSearchTextChange = (event) => {
    const activeSearchText = event.target.value;
    setSearchText(activeSearchText);
    handleSearch(activeSearchText);
  };

  //
  const [myKi, setKi] = useState(-1);
  const [progressTCX, setProgressTCX] = useState('Aquired');
  const [resolution, setResolution] = useState('');
  const [rt, rtt] = useState(false);
  const progressMe = ['Aquired', 'In Progress', 'Send Resolution'];

  const handleProgress = (e) => {
    const { value } = e.target;
    setProgressTCX(value);
  };
  const saveProgress = (KeyID) => {
    const referenceQueue = ref(database, 'AquiredTickets/' + KeyID); 
    const data = {
      Progress: progressTCX,
    }
    update(referenceQueue, data).then(()=>{
      alert('update success : ' + progressTCX + KeyID);
    }).catch((err)=> alert(err.message))
  };

  const handleResolution = (e) => {
    const { value } = e.target;
    setResolution(value);
  };
  const saveResolution = (KeyID) => {
    const referenceQueue = ref(database, 'AquiredTickets/' + KeyID); 
    const data = {
      Resolution: resolution,
      Progress: 'Send Feedback',
    }
    update(referenceQueue, data).then(()=>{
      console.log('update success : ' + resolution + KeyID);
    }).catch((err)=> alert(err.message))
  };

  // chat
  const [comment, setComment] = useState('');
  const handleCommentChange = (newComment) => {
    setComment(newComment);
  };
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
  const [openC, setC] = useState(-1);
  const openComment =(index)=>{
    setC(index)
  }
  const closeComment =()=>{
    setC(-1)
  }
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

  const deleteComment =(index)=>{
    const referenceQueue = ref(database, `${index}`);
    remove(referenceQueue).then(() => alert('deleted comments'));
  }
 

  return (
    <>
      <div>
        <div id="Acsjdaj">In Progress</div>
      </div>
      <div id="Zumbie">
        <div id="xumbie1">
          {filteredAcqs.map((AqData, Indx) =>
            AqData.AquiredBy === email && AqData.Progress === 'In Progress' ? (
              <div id="acs333434" 
               onClick={()=>{
                  setKi(AqData.keyID)
                  setResolution(-1)
               }} key={Indx}>
                <div id="txs1">
                  {AqData.Priority === 'High' ? (
                    <div id="prHigh" />
                  ) : AqData.Priority === 'Medium' ? (
                    <div id="prMed" />
                  ) : AqData.Priority === 'Low' ? (
                    <div id="prLow" />
                  ) : null}
                </div>
                <div id="txs2">{AqData.Name.slice(0, 10)}...</div>
              </div>
            ) : null
          )}

          {filteredAcqs.map((AqData, Inx)=>(<>
               {myKi === AqData.keyID ? (<>
                  <div key={Inx} id='tsxAcUpProgress'>
                    <div id='tsxAcUpProgressID'>
                      <div id='tsxAcUpProgressID1'>
                        <div id="txs1">
                          {AqData.Priority === 'High' ? (
                            <div id="prHigh" />
                          ) : AqData.Priority === 'Medium' ? (
                            <div id="prMed" />
                          ) : AqData.Priority === 'Low' ? (
                            <div id="prLow" />
                          ) : null}
                        </div>
                      </div>
                      <div>
                         {AqData.Priority === 'High' ? (
                            <span id='chsHigh'>{AqData.Priority}</span>
                          ) : AqData.Priority === 'Medium' ? (
                            <span id='chsMed'>{AqData.Priority}</span>
                          ) : AqData.Priority === 'Low' ? (
                            <span id='chsLow'>{AqData.Priority}</span>
                          ) : null}
                         {AqData.Name}
                      </div>
                    </div>
  
                    <div>
                      <div>
                        <select 
                            id="prxDaSelect"
                            name="Progress"
                            value={progressTCX}
                            onChange={handleProgress}
                            >
                            {progressMe.map((progressMe) =>(
                              <option key={progressMe} value={progressMe}>
                                {progressMe}
                              </option>
                            ))}
                        </select>
                        <button id='prxDaSelect1' onClick={()=>{
                          const KeyID = AqData.KeyID;
                          saveProgress(KeyID)
                        }}>Save</button>
                      </div>

                      <div id='ssdvi343'>
                        <div>Progress: <span>{AqData.Progress}</span></div>
                      </div>

                      <div id='ssdvi3434Poco'>
                        <div>
                          <label>Category:</label><br/>
                          <span>{AqData.Category}</span>
                        </div>
                        <div>
                         <label>Description:</label> <br/>
                         <span>{AqData.Description}</span>
                        </div>
                      </div>
                     
                      <div>
                        <div id='chsHTXS'>From : {AqData.Time} Date/{AqData.Day}-{AqData.Month}-{AqData.Year}
                        <br/><span>{AqData.Owner} a {AqData.Role}</span></div>
                      </div>
                      
                      {AqData.Progress === 'Send Resolution' || AqData.Progress === 'Send Feedback' ? (<>
                        <div id='btndvi'>
                          <button onClick={()=>{
                            setResolution(AqData.Resolution) 
                            rtt(true);    
                          }}>Resolution</button>
                          {rt === true ? (<>
                            <button onClick={()=>{
                              const KeyID = AqData.KeyID;
                              saveResolution(KeyID);
                              rtt(false)
                            }}>Save</button>
                          </>):null}
                        </div>
                      </>) : null}
                      {/* error lenght */}
                      {rt === true ? (<>
                        <div id='resolutionSent'>
                          <div>
                            <textarea
                              placeholder="Send Resolution"
                              id="Resolution"
                              name="Resolution"
                              value={resolution}
                              onChange={handleResolution}
                              />
                          </div>
                        </div>
                      </>) : null}

                      <div id='chsHighbuttons'>
                        <button onClick={()=>{
                           setKi(null)
                        }}>close</button>
                        <span onClick={()=>{
                           openComment(AqData.KeyID)
                           commentIndexter(AqData.KeyID)
                        }}>
                           comments
                        </span>
                      </div>
                    </div>
                  </div>

                {/* Chats */}
                {openC === AqData.KeyID ? (<>
                  {liveChat.length >= 0 ? (<>
                    <div id='queFloatChats'>
                        <div id='commentcontainer029'>
                            {/*  */}
                              <div>
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
                                  </>):(<>
                                    <div>
                                      No Comments Yet
                                    </div>
                                  </>)}
                                </div>
                              </div>

                              <div id="commentassined">
                                <div>
                                  <div id='cmt83838'>
                                    <input type='text'
                                        id="comment"
                                        name="comment"
                                        placeholder="Live Comment..."
                                        value={comment}
                                        onChange={(event) => handleCommentChange(event.target.value)}
                                      />
                                    <div id="commentkflex">
                                      <button id="commentbtn444" onClick={() => {
                                        const  keyIDIndexter = AqData.KeyID
                                        commentID(keyIDIndexter); 
                                        commentIndexter(keyIDIndexter)}}>
                                          Comment
                                        </button>
                                     
                                    </div>
                                    
                                  </div>
                                  <div id='cmt343'>
                                     <div onClick={()=>{
                                     commentIndexter(AqData.KeyID); 
                                     closeComment()}}>
                                      <RiDeleteBack2Fill />
                                     </div>
                                    <div onClick={()=>{
                                     deleteComment(AqData.KeyID)
                                     commentIndexter(AqData.KeyID); 
                                     closeComment()}}>
                                      <RiDeleteBin5Line />
                                     </div>
                                  </div>
                                </div>
                              </div>
                          {/*  */}
                       </div>
                    </div>
                  </>):(<></>)}
               </>):(<></>)}
              {/* Chats */}

            </>) : null}
          </>))}
        </div>
      </div>


      
    </>
  );
};

export default InqueProgress;



const SendResolution = () => {
  const { email } = Moderator();
  const [aquired, setAquired] = useState([]);
  const [oldqueue1, setOldQueue1] = useState([]);

  const fetchData2 = () => {
    const myReference = ref(database, 'AquiredTickets');
    onValue(myReference, (snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        const keyID = childSnapshot.key;
        data.push({
          ...user,
          keyID: keyID,
        });
      });
      setAquired(data);
      setOldQueue1(data);
    });
  };

  useEffect(() => {
    fetchData2();
  }, []);

  const filteredAcqs = aquired.filter((data) => data.AquiredBy === email);

  const [searchText, setSearchText] = useState('');

  const handleSearch = (activeSearchText) => {
    if (activeSearchText.trim() === '') {
      setAquired(oldqueue1);
    } else {
      const filteredUsers = aquired.filter(
        (user) =>
          user.Name.toLowerCase().includes(activeSearchText.toLowerCase()) ||
          user.Category.toLowerCase().includes(activeSearchText.toLowerCase()) ||
          user.Priority.toLowerCase().includes(activeSearchText.toLowerCase())
      );
      setAquired(filteredUsers);
    }
  };
  const handleSearchTextChange = (event) => {
    const activeSearchText = event.target.value;
    setSearchText(activeSearchText);
    handleSearch(activeSearchText);
  };

  //
  const [myKi, setKi] = useState(-1);
  const [progressTCX, setProgressTCX] = useState('Aquired');
  const [resolution, setResolution] = useState('');
  const [rt, rtt] = useState(false);
  const progressMe = ['Aquired', 'In Progress', 'Send Resolution'];

  const handleProgress = (e) => {
    const { value } = e.target;
    setProgressTCX(value);
  };
  const saveProgress = (KeyID) => {
    const referenceQueue = ref(database, 'AquiredTickets/' + KeyID); 
    const data = {
      Progress: progressTCX,
    }
    update(referenceQueue, data).then(()=>{
      alert('update success : ' + progressTCX + KeyID);
    }).catch((err)=> alert(err.message))
  };

  const handleResolution = (e) => {
    const { value } = e.target;
    setResolution(value);
  };
  const saveResolution = (KeyID) => {
    const referenceQueue = ref(database, 'AquiredTickets/' + KeyID); 
    const data = {
      Resolution: resolution,
      Progress: 'Send Feedback',
    }
    update(referenceQueue, data).then(()=>{
      console.log('update success : ' + resolution + KeyID);
    }).catch((err)=> alert(err.message))
  };

  // chat
  const [comment, setComment] = useState('');
  const handleCommentChange = (newComment) => {
    setComment(newComment);
  };
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
  const [openC, setC] = useState(-1);
  const openComment =(index)=>{
    setC(index)
  }
  const closeComment =()=>{
    setC(-1)
  }
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

  const deleteComment =(index)=>{
    const referenceQueue = ref(database, `${index}`);
    remove(referenceQueue).then(() => alert('deleted comments'));
  }
 

  return (
    <>
      <div>
        <div id="Acsjdaj">Send Resolution</div>
      </div>
      <div id="Zumbie">
        <div id="xumbie1">
          {filteredAcqs.map((AqData, Indx) =>
            AqData.AquiredBy === email && AqData.Progress === 'Send Resolution' ? (
              <div id="acs333434" 
               onClick={()=>{
                  setKi(AqData.keyID)
                  setResolution(-1)
               }} key={Indx}>
                <div id="txs1">
                  {AqData.Priority === 'High' ? (
                    <div id="prHigh" />
                  ) : AqData.Priority === 'Medium' ? (
                    <div id="prMed" />
                  ) : AqData.Priority === 'Low' ? (
                    <div id="prLow" />
                  ) : null}
                </div>
                <div id="txs2">{AqData.Name.slice(0, 10)}...</div>
              </div>
            ) : null
          )}

          {filteredAcqs.map((AqData, Inx)=>(<>
               {myKi === AqData.keyID ? (<>
                  <div key={Inx} id='tsxAcUpProgress'>
                    <div id='tsxAcUpProgressID'>
                      <div id='tsxAcUpProgressID1'>
                        <div id="txs1">
                          {AqData.Priority === 'High' ? (
                            <div id="prHigh" />
                          ) : AqData.Priority === 'Medium' ? (
                            <div id="prMed" />
                          ) : AqData.Priority === 'Low' ? (
                            <div id="prLow" />
                          ) : null}
                        </div>
                      </div>
                      <div>
                         {AqData.Priority === 'High' ? (
                            <span id='chsHigh'>{AqData.Priority}</span>
                          ) : AqData.Priority === 'Medium' ? (
                            <span id='chsMed'>{AqData.Priority}</span>
                          ) : AqData.Priority === 'Low' ? (
                            <span id='chsLow'>{AqData.Priority}</span>
                          ) : null}
                         {AqData.Name}
                      </div>
                    </div>
  
                    <div>
                      <div>
                        <select 
                            id="prxDaSelect"
                            name="Progress"
                            value={progressTCX}
                            onChange={handleProgress}
                            >
                            {progressMe.map((progressMe) =>(
                              <option key={progressMe} value={progressMe}>
                                {progressMe}
                              </option>
                            ))}
                        </select>
                        <button id='prxDaSelect1' onClick={()=>{
                          const KeyID = AqData.KeyID;
                          saveProgress(KeyID)
                        }}>Save</button>
                      </div>

                      <div id='ssdvi343'>
                        <div>Progress: <span>{AqData.Progress}</span></div>
                      </div>

                      <div id='ssdvi3434Poco'>
                        <div>
                          <label>Category:</label><br/>
                          <span>{AqData.Category}</span>
                        </div>
                        <div>
                         <label>Description:</label> <br/>
                         <span>{AqData.Description}</span>
                        </div>
                      </div>
                     
                      <div>
                        <div id='chsHTXS'>From : {AqData.Time} Date/{AqData.Day}-{AqData.Month}-{AqData.Year}
                        <br/><span>{AqData.Owner} a {AqData.Role}</span></div>
                      </div>
                      
                      {AqData.Progress === 'Send Resolution' || AqData.Progress === 'Send Feedback' ? (<>
                        <div id='btndvi'>
                          <button onClick={()=>{
                            setResolution(AqData.Resolution) 
                            rtt(true);    
                          }}>Resolution</button>
                          {rt === true ? (<>
                            <button onClick={()=>{
                              const KeyID = AqData.KeyID;
                              saveResolution(KeyID);
                              rtt(false)
                            }}>Save</button>
                          </>):null}
                        </div>
                      </>) : null}
                      {/* error lenght */}
                      {rt === true ? (<>
                        <div id='resolutionSent'>
                          <div>
                            <textarea
                              placeholder="Send Resolution"
                              id="Resolution"
                              name="Resolution"
                              value={resolution}
                              onChange={handleResolution}
                              />
                          </div>
                        </div>
                      </>) : null}

                      <div id='chsHighbuttons'>
                        <button onClick={()=>{
                           setKi(null)
                        }}>close</button>
                        <span onClick={()=>{
                           openComment(AqData.KeyID)
                           commentIndexter(AqData.KeyID)
                        }}>
                           comments
                        </span>
                      </div>
                    </div>
                  </div>

                {/* Chats */}
                {openC === AqData.KeyID ? (<>
                  {liveChat.length >= 0 ? (<>
                    <div id='queFloatChats'>
                        <div id='commentcontainer029'>
                            {/*  */}
                              <div>
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
                                  </>):(<>
                                    <div>
                                      No Comments Yet
                                    </div>
                                  </>)}
                                </div>
                              </div>

                              <div id="commentassined">
                                <div>
                                  <div id='cmt83838'>
                                    <input type='text'
                                        id="comment"
                                        name="comment"
                                        placeholder="Live Comment..."
                                        value={comment}
                                        onChange={(event) => handleCommentChange(event.target.value)}
                                      />
                                    <div id="commentkflex">
                                      <button id="commentbtn444" onClick={() => {
                                        const  keyIDIndexter = AqData.KeyID
                                        commentID(keyIDIndexter); 
                                        commentIndexter(keyIDIndexter)}}>
                                          Comment
                                        </button>
                                     
                                    </div>
                                    
                                  </div>
                                  <div id='cmt343'>
                                     <div onClick={()=>{
                                     commentIndexter(AqData.KeyID); 
                                     closeComment()}}>
                                      <RiDeleteBack2Fill />
                                     </div>
                                    <div onClick={()=>{
                                     deleteComment(AqData.KeyID)
                                     commentIndexter(AqData.KeyID); 
                                     closeComment()}}>
                                      <RiDeleteBin5Line />
                                     </div>
                                  </div>
                                </div>
                              </div>
                          {/*  */}
                       </div>
                    </div>
                  </>):(<></>)}
               </>):(<></>)}
              {/* Chats */}

            </>) : null}
          </>))}
        </div>
      </div>


      
    </>
  );
};

export {SendResolution};




const SendResolved = () => {
  const { email } = Moderator();
  const [aquired, setAquired] = useState([]);
  const [oldqueue1, setOldQueue1] = useState([]);

  const fetchData2 = () => {
    const myReference = ref(database, 'AquiredTickets');
    onValue(myReference, (snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        const keyID = childSnapshot.key;
        data.push({
          ...user,
          keyID: keyID,
        });
      });
      setAquired(data);
      setOldQueue1(data);
    });
  };

  useEffect(() => {
    fetchData2();
  }, []);

  const filteredAcqs = aquired.filter((data) => data.AquiredBy === email && data.Progress === 'Resolved');

  const [searchText, setSearchText] = useState('');

  const handleSearch = (activeSearchText) => {
    if (activeSearchText.trim() === '') {
      setAquired(oldqueue1);
    } else {
      const filteredUsers = aquired.filter(
        (user) =>
          user.Name.toLowerCase().includes(activeSearchText.toLowerCase()) ||
          user.Category.toLowerCase().includes(activeSearchText.toLowerCase()) ||
          user.Priority.toLowerCase().includes(activeSearchText.toLowerCase())
      );
      setAquired(filteredUsers);
    }
  };
  const handleSearchTextChange = (event) => {
    const activeSearchText = event.target.value;
    setSearchText(activeSearchText);
    handleSearch(activeSearchText);
  };

  //
  const [myKi, setKi] = useState(-1);
  const [progressTCX, setProgressTCX] = useState('Aquired');
  const [resolution, setResolution] = useState('');
  const [rt, rtt] = useState(false);
  const progressMe = ['Aquired', 'In Progress', 'Send Resolution'];

  const handleProgress = (e) => {
    const { value } = e.target;
    setProgressTCX(value);
  };
  const saveProgress = (KeyID) => {
    const referenceQueue = ref(database, 'AquiredTickets/' + KeyID); 
    const data = {
      Progress: progressTCX,
    }
    update(referenceQueue, data).then(()=>{
      alert('update success : ' + progressTCX + KeyID);
    }).catch((err)=> alert(err.message))
  };

  const handleResolution = (e) => {
    const { value } = e.target;
    setResolution(value);
  };
  const saveResolution = (KeyID) => {
    const referenceQueue = ref(database, 'AquiredTickets/' + KeyID); 
    const data = {
      Resolution: resolution,
      Progress: 'Send Feedback',
    }
    update(referenceQueue, data).then(()=>{
      console.log('update success : ' + resolution + KeyID);
    }).catch((err)=> alert(err.message))
  };

  // chat
  const [comment, setComment] = useState('');
  const handleCommentChange = (newComment) => {
    setComment(newComment);
  };
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
  const [openC, setC] = useState(-1);
  const openComment =(index)=>{
    setC(index)
  }
  const closeComment =()=>{
    setC(-1)
  }
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

  const deleteComment =(index)=>{
    const referenceQueue = ref(database, `${index}`);
    remove(referenceQueue).then(() => alert('deleted comments'));
  }
 

  return (
    <>
      <div>
        <div id="Acsjdaj">Resolved</div>
      </div>
      <div id="Zumbie">
        <div id="xumbie1">
          {filteredAcqs.map((AqData, Indx) =>
            AqData.AquiredBy === email ? (
              <div id="acs333434" 
               onClick={()=>{
                  setKi(AqData.keyID)
                  setResolution(-1)
               }} key={Indx}>
                <div id="txs1">
                  {AqData.Priority === 'High' ? (
                    <div id="prHigh" />
                  ) : AqData.Priority === 'Medium' ? (
                    <div id="prMed" />
                  ) : AqData.Priority === 'Low' ? (
                    <div id="prLow" />
                  ) : null}
                </div>
                <div id="txs2">{AqData.Name.slice(0, 10)}...</div>
              </div>
            ) : null
          )}

          {filteredAcqs.map((AqData, Inx)=>(<>
               {myKi === AqData.keyID ? (<>
                  <div key={Inx} id='tsxAcUpProgress'>
                    <div id='tsxAcUpProgressID'>
                      <div id='tsxAcUpProgressID1'>
                        <div id="txs1">
                          {AqData.Priority === 'High' ? (
                            <div id="prHigh" />
                          ) : AqData.Priority === 'Medium' ? (
                            <div id="prMed" />
                          ) : AqData.Priority === 'Low' ? (
                            <div id="prLow" />
                          ) : null}
                        </div>
                      </div>
                      <div>
                         {AqData.Priority === 'High' ? (
                            <span id='chsHigh'>{AqData.Priority}</span>
                          ) : AqData.Priority === 'Medium' ? (
                            <span id='chsMed'>{AqData.Priority}</span>
                          ) : AqData.Priority === 'Low' ? (
                            <span id='chsLow'>{AqData.Priority}</span>
                          ) : null}
                         {AqData.Name}
                      </div>
                    </div>
  
                    <div>
                    
                      {/* <div>
                        <select 
                            id="prxDaSelect"
                            name="Progress"
                            value={progressTCX}
                            onChange={handleProgress}
                            >
                            {progressMe.map((progressMe) =>(
                              <option key={progressMe} value={progressMe}>
                                {progressMe}
                              </option>
                            ))}
                        </select>
                        <button id='prxDaSelect1' onClick={()=>{
                          const KeyID = AqData.KeyID;
                          saveProgress(KeyID)
                        }}>Save</button>
                      </div> */}

                      <div id='ssdvi343'>
                        <div>Progress: <span>{AqData.Progress}</span></div>
                      </div>

                      <div id='ssdvi3434Poco'>
                        <div>
                          <label>Category:</label><br/>
                          <span>{AqData.Category}</span>
                        </div>
                        <div>
                         <label>Description:</label> <br/>
                         <span>{AqData.Description}</span>
                        </div>
                      </div>
                     
                      <div>
                        <div id='chsHTXS'>From : {AqData.Time} Date/{AqData.Day}-{AqData.Month}-{AqData.Year}
                        <br/><span>{AqData.Owner} a {AqData.Role}</span></div>
                      </div>
                      
                      {AqData.Progress === 'Send Resolution' || AqData.Progress === 'Send Feedback' ? (<>
                        <div id='btndvi'>
                          <button onClick={()=>{
                            setResolution(AqData.Resolution) 
                            rtt(true);    
                          }}>Resolution</button>
                          {rt === true ? (<>
                            <button onClick={()=>{
                              const KeyID = AqData.KeyID;
                              saveResolution(KeyID);
                              rtt(false)
                            }}>Save</button>
                          </>):null}
                        </div>
                      </>) : null}
                      {/* error lenght */}
                      {rt === true ? (<>
                        <div id='resolutionSent'>
                          <div>
                            <textarea
                              placeholder="Send Resolution"
                              id="Resolution"
                              name="Resolution"
                              value={resolution}
                              onChange={handleResolution}
                              />
                          </div>
                        </div>
                      </>) : null}

                      <div id='chsHighbuttons'>
                        <button onClick={()=>{
                           setKi(null)
                        }}>close</button>
                        <span onClick={()=>{
                           openComment(AqData.KeyID)
                           commentIndexter(AqData.KeyID)
                        }}>
                           comments
                        </span>
                      </div>
                    </div>
                  </div>

                {/* Chats */}
                {openC === AqData.KeyID ? (<>
                  {liveChat.length >= 0 ? (<>
                    <div id='queFloatChats'>
                        <div id='commentcontainer029'>
                            {/*  */}
                              <div>
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
                                  </>):(<>
                                    <div>
                                      No Comments Yet
                                    </div>
                                  </>)}
                                </div>
                              </div>

                              <div id="commentassined">
                                <div>
                                  <div id='cmt83838'>
                                    <input type='text'
                                        id="comment"
                                        name="comment"
                                        placeholder="Live Comment..."
                                        value={comment}
                                        onChange={(event) => handleCommentChange(event.target.value)}
                                      />
                                    <div id="commentkflex">
                                      <button id="commentbtn444" onClick={() => {
                                        const  keyIDIndexter = AqData.KeyID
                                        commentID(keyIDIndexter); 
                                        commentIndexter(keyIDIndexter)}}>
                                          Comment
                                        </button>
                                     
                                    </div>
                                    
                                  </div>
                                  <div id='cmt343'>
                                     <div onClick={()=>{
                                     commentIndexter(AqData.KeyID); 
                                     closeComment()}}>
                                      <RiDeleteBack2Fill />
                                     </div>
                                    <div onClick={()=>{
                                     deleteComment(AqData.KeyID)
                                     commentIndexter(AqData.KeyID); 
                                     closeComment()}}>
                                      <RiDeleteBin5Line />
                                     </div>
                                  </div>
                                </div>
                              </div>
                          {/*  */}
                       </div>
                    </div>
                  </>):(<></>)}
               </>):(<></>)}
              {/* Chats */}

            </>) : null}
          </>))}
        </div>
      </div>
      
    </>
  );
};

export {SendResolved};




 