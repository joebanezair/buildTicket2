import { TfiCommentAlt } from "react-icons/tfi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { CgComment } from "react-icons/cg";
import React, { useEffect, useState } from 'react';
import Moderator from '../../context/Moderator';
import { database } from '../../firebase/firebase';
import { onValue, push, ref, remove, set, update } from 'firebase/database';

const AquiredMine = () => {
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

  const filteredAcqs = aquired.filter((data) => data.Owner === email && data.Progress === 'Aquired');

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
  
  //

  return (
    <>
      <div>
        <div id="searchInpt33">
          <div>
            <input
              id="quesearch"
              type="search"
              placeholder="Search Aquired"
              value={searchText}
              onChange={handleSearchTextChange}
            />
          </div>
        </div>
        <div id="Acsjdaj">Aquired Tickets {filteredAcqs.length}</div>
      </div>
      <div id="Zumbie">
        <div id="xumbie1ss">
          {filteredAcqs.map((AqData, Indx) =>
            AqData.AquiredBy === email ? (
              <div id="acs333431" 
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
                        <div id='chsHTXS'>Acquired By : {AqData.Time} Date/{AqData.Day}-{AqData.Month}-{AqData.Year}
                        <br/><span>{AqData.AquiredBy} </span></div>
                      </div>

                      {AqData.Resolution.length > 0 ? (<>
                        <div id="res4femamska">
                          {AqData.Resolution}
                        </div>
                      </>) : null}

                      <div id='chsHighbuttons'>
                        <button onClick={()=>{
                           setKi(null)
                        }}>close</button>
                        <span onClick={()=>{
                           openComment(AqData.KeyID)
                           const  keyIDIndexter = AqData.KeyID
                          //  commentID(keyIDIndexter); 
                           commentIndexter(keyIDIndexter)
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
                                    {liveChat.map((chat, index)=> 
                                    (<div key={index}>
                                        <div id="commentIDContainerLive">
                                          <div id="commentemail">{chat.userEmail} - {chat.date} - {chat.time}</div>
                                          <div id="commentmetadata">
                                          <div>{chat.userComment}</div>
                                        </div>
                                       </div>
                                     </div>)  
                                    )}
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

export default AquiredMine;


const SendFeedbackMine = () => {
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

  const filteredAcqs = aquired.filter((data) => data.Owner === email && data.Progress === 'Send Feedback');

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
  
  //
  const [feedRating, setFeedRating] = useState({
    feedback: '',
    rating: '',
    // Add other properties if needed
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedRating((prevFeedRating) => ({
      ...prevFeedRating,
      [name]: value,
    }));
  };

  const updateRatingFeedback = (KeyID) => {
    const feedback = ''+feedRating.feedback;
    const rating = ''+feedRating.rating;
    const referenceQueue = ref(database, 'AquiredTickets/' + KeyID); 
    const UpdateFeedback = {
      Rating: rating,
      Feedback: feedback,
      Progress: 'Resolved',
    }
    update(referenceQueue, UpdateFeedback).then(()=>{
      alert('Feedback updated');
    })
  };

  return (
    <>
      <div>
        <div id="searchInpt33">
          <div>
            <input
              id="quesearch"
              type="search"
              placeholder="Search Feedback"
              value={searchText}
              onChange={handleSearchTextChange}
            />
          </div>
        </div>
        <div id="Acsjdaj">Needs FeedBack {filteredAcqs.length}</div>
      </div>
      <div id="Zumbie">
        <div id="xumbie1ss">
          {filteredAcqs.map((AqData, Indx) =>
            AqData.AquiredBy === email ? (
              <div id="acs333431" 
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
                        <div id='chsHTXS'>Acquired By : {AqData.Time} Date/{AqData.Day}-{AqData.Month}-{AqData.Year}
                        <br/><span>{AqData.AquiredBy} </span></div>
                      </div>

                      {AqData.Resolution.length > 0 ? (<>
                        <div id="res4femamska">
                          {AqData.Resolution}
                        </div>
                      </>) : null}

                      {AqData.Resolution.length > 0 ? (
                      <>
                        <div id="res4femamska1">
                          <div>
                            <input
                              type="text"
                              id="feedback"
                              name="feedback"
                              value={feedRating.feedback}
                              onChange={handleInputChange}
                              placeholder="Enter your feedback"
                            />
                          </div>

                          <div>
                            <select
                              id="rating"
                              name="rating"
                              value={feedRating.rating}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Rate (1-5)</option>
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <option key={rating} value={rating}>
                                  {rating}
                                </option>
                              ))}
                            </select>
                            <button onClick={()=>{
                              updateRatingFeedback(AqData.keyID)
                            }}>Send</button>
                          </div>

                          {/* Your existing code */}
                        </div>
                      </>
                    ) : null}


                      <div id='chsHighbuttons'>
                        <button onClick={()=>{
                           setKi(null)
                        }}>close</button>
                        <span onClick={()=>{
                           openComment(AqData.KeyID)
                           const  keyIDIndexter = AqData.KeyID
                          //  commentID(keyIDIndexter); 
                           commentIndexter(keyIDIndexter)
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
                                    {liveChat.map((chat, index)=> 
                                    (<div key={index}>
                                        <div id="commentIDContainerLive">
                                          <div id="commentemail">{chat.userEmail} - {chat.date} - {chat.time}</div>
                                          <div id="commentmetadata">
                                          <div>{chat.userComment}</div>
                                        </div>
                                       </div>
                                     </div>)  
                                    )}
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

export {SendFeedbackMine};






const InProgressMine = () => {
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

  const filteredAcqs = aquired.filter((data) => data.Owner === email && data.Progress === 'In Progress');

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
  
  //
  const [feedRating, setFeedRating] = useState({
    feedback: '',
    rating: '',
    // Add other properties if needed
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedRating((prevFeedRating) => ({
      ...prevFeedRating,
      [name]: value,
    }));
  };

  const updateRatingFeedback = (KeyID) => {
    const feedback = ''+feedRating.feedback;
    const rating = ''+feedRating.rating;
    const referenceQueue = ref(database, 'AquiredTickets/' + KeyID); 
    const UpdateFeedback = {
      Rating: rating,
      Feedback: feedback,
      Progress: 'Resolved',
    }
    update(referenceQueue, UpdateFeedback).then(()=>{
      alert('Feedback updated');
    })
  };

  return (
    <>
      <div>
        <div id="searchInpt33">
          <div>
            <input
              id="quesearch"
              type="search"
              placeholder="Search Feedback"
              value={searchText}
              onChange={handleSearchTextChange}
            />
          </div>
        </div>
        <div id="Acsjdaj">In Progress {filteredAcqs.length}</div>
      </div>
      <div id="Zumbie">
        <div id="xumbie1ss">
          {filteredAcqs.map((AqData, Indx) =>
            AqData.AquiredBy === email ? (
              <div id="acs333431" 
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
                        <div id='chsHTXS'>Acquired By : {AqData.Time} Date/{AqData.Day}-{AqData.Month}-{AqData.Year}
                        <br/><span>{AqData.AquiredBy} </span></div>
                      </div>

                      {AqData.Resolution === 'Send Feedback' ? (<>
                        <div id="res4femamska">
                          {AqData.Resolution}
                        </div>
                      </>) : null}

                      {AqData.Resolution === 'Send Feedback' ? (
                      <>
                        <div id="res4femamska1">
                          <div>
                            <input
                              type="text"
                              id="feedback"
                              name="feedback"
                              value={feedRating.feedback}
                              onChange={handleInputChange}
                              placeholder="Enter your feedback"
                            />
                          </div>

                          <div>
                            <select
                              id="rating"
                              name="rating"
                              value={feedRating.rating}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Rate (1-5)</option>
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <option key={rating} value={rating}>
                                  {rating}
                                </option>
                              ))}
                            </select>
                            <button onClick={()=>{
                              updateRatingFeedback(AqData.keyID)
                            }}>Send</button>
                          </div>

                          {/* Your existing code */}
                        </div>
                      </>
                    ) : null}


                      <div id='chsHighbuttons'>
                        <button onClick={()=>{
                           setKi(null)
                        }}>close</button>
                        <span onClick={()=>{
                           openComment(AqData.KeyID)
                           const  keyIDIndexter = AqData.KeyID
                          //  commentID(keyIDIndexter); 
                           commentIndexter(keyIDIndexter)
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
                                    {liveChat.map((chat, index)=> 
                                    (<div key={index}>
                                        <div id="commentIDContainerLive">
                                          <div id="commentemail">{chat.userEmail} - {chat.date} - {chat.time}</div>
                                          <div id="commentmetadata">
                                          <div>{chat.userComment}</div>
                                        </div>
                                       </div>
                                     </div>)  
                                    )}
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

export {InProgressMine};





const ResolvedMine = () => {
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

  const filteredAcqs = aquired.filter((data) => data.Owner === email && data.Progress === 'Resolved');

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
  
  //

  return (
    <>
      <div>
        <div id="searchInpt33">
          <div>
            <input
              id="quesearch"
              type="search"
              placeholder="Search Resolved"
              value={searchText}
              onChange={handleSearchTextChange}
            />
          </div>
        </div>
        <div id="Acsjdaj">Resolved Tickets {filteredAcqs.length}</div>
      </div>
      <div id="Zumbie">
        <div id="xumbie1ss">
          {filteredAcqs.map((AqData, Indx) =>
            AqData.AquiredBy === email ? (
              <div id="acs333431" 
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
                        <div id='chsHTXS'>Acquired By : {AqData.Time} Date/{AqData.Day}-{AqData.Month}-{AqData.Year}
                        <br/><span>{AqData.AquiredBy} </span></div>
                      </div>

                      {AqData.Resolution.length > 0 ? (<>
                        <div id="res4femamska">
                          {AqData.Resolution}
                        </div>
                      </>) : null}

                      <div id='chsHighbuttons'>
                        <button onClick={()=>{
                           setKi(null)
                        }}>close</button>
                        <span onClick={()=>{
                           openComment(AqData.KeyID)
                           const  keyIDIndexter = AqData.KeyID
                          //  commentID(keyIDIndexter); 
                           commentIndexter(keyIDIndexter)
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
                                    {liveChat.map((chat, index)=> 
                                    (<div key={index}>
                                        <div id="commentIDContainerLive">
                                          <div id="commentemail">{chat.userEmail} - {chat.date} - {chat.time}</div>
                                          <div id="commentmetadata">
                                          <div>{chat.userComment}</div>
                                        </div>
                                       </div>
                                     </div>)  
                                    )}
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

export {ResolvedMine};