import { RiGitPullRequestFill } from "react-icons/ri";
import React, { useEffect, useState } from 'react'
import { child, get, getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database';
import longteachers from '../../user-dashboard/teachers/components/longteachers';
import Moderator from '../../context/Moderator';
import { VscBriefcase, VscDebugContinue, VscBookmark, VscTrash, VscArrowCircleLeft, VscVerifiedFilled } from "react-icons/vsc";
import { database } from '../../firebase/firebase';
import NormalTicket from "../../user-dashboard/technicians/techcomponents/NormalTicket";
const priorities = ['High', 'Medium', 'Low'];

const Inque = () => {
  const [queueTickets, setQueue] = useState([]);
  const [oldqueue, setoldqueue] = useState([]);
  const [filteredQueue, setFiltered] = useState([]);
  const { email } = Moderator();
  const  {emptyQueueMessage} = longteachers();
  const [editingIndex, setEditingIndex] = useState(-1);
  const [delModal, setDelModal] = useState(false);

  //removable
  const [registeredUser, setRegistered] = useState([]);
  const [filteredUser, setFiltered2] = useState([]);
  useEffect(() => {
     const fetchData = () => {
       const myreference = ref(database, 'RegisteredUsers');
        onValue(myreference, (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val(); // Get user data directly
          data.push(user);
        });
         setRegistered(data);
        });
     };
       fetchData();
     }, []);
     useEffect(() => {
       if (registeredUser.length > 0) {
         const filteredUsers = registeredUser.filter((user) => user.email === email);
         setFiltered2(filteredUsers);
       }
  }, [registeredUser, email]);
  //removable

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
  useEffect(() => {
    fetchData();
  }, []);

  let count = 1;
  useEffect(()=>{
    if(queueTickets.length > 0){
      const filteredQ = queueTickets.filter((data)=> data.owner === email);
      setFiltered(filteredQ); 
    }
  },[queueTickets, email])

  // removable
 
  const [formData, setFormData] = useState({
    name: '',
    problemCategory: '',
    description: '',
    priority: 'Medium', // Default priority
    floor: '1st floor', // Default floor
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const editQue = (index) => {
    setEditingIndex(index);
    const selectedItem = filteredQueue[index];
    setFormData({
      name: selectedItem.name,
      problemCategory: selectedItem.problemCategory,
      description: selectedItem.description,
      priority: selectedItem.priority,
      floor: selectedItem.floor,
    });
  };

  //floor
  const floors = [];
  for (let i = 1; i <= 8; i++) {
     let floorName;
     if (i === 1) {
       floorName = `${i}st floor`;
     } else if (i === 2) {
       floorName = `${i}nd floor`;
     } else if (i === 3) {
       floorName = `${i}rd floor`;
     } else {
       floorName = `${i}th floor`;
     }
     floors.push(floorName);
  }
  //floor

  //medium category removable
  const [categoryMedium, setCategoryMedium] = useState([]);
  const [categoryHigh, setCategoryHigh] = useState([]);
  const [categoryLow, setCategoryLow] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategory = (categoryName, setterFunction) => {
      const myReference = ref(database, categoryName);
      onValue(myReference, (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const catData = childSnapshot.val();
          const keyID = childSnapshot.key;
          data.push({ ...catData, keyID });
        });
        setterFunction(data);
      });
    };
    fetchCategory('Categorymedium', setCategoryMedium);
    fetchCategory('Categoryhigh', setCategoryHigh);
    fetchCategory('Categorylow', setCategoryLow);
  }, []);

  useEffect(() => {
    let categoryNames = ['Category N/A'];
    if (formData.priority === 'Medium') {
      categoryNames = categoryMedium.map((item) => item.name);
    } else if (formData.priority === 'High') {
      categoryNames = categoryHigh.map((item) => item.name);
    } else if (formData.priority === 'Low') {
      categoryNames = categoryLow.map((item) => item.name);
    }
    setCategories(categoryNames);
  }, [formData.priority, categoryMedium, categoryHigh, categoryLow]);

  //medium category removable
  //
  const saveQue = (index, role) => {
    const itemToSave = filteredQueue[index];
    const referenceQueue = ref(database, 'InqueTickets/'+itemToSave.keyID);
    const updateQue = {
      name: formData.name,
      description: formData.description,
      priority: formData.priority,
      problemCategory: formData.problemCategory,
      floor: formData.floor,
      owner: email,
      role: role,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    }
    set(referenceQueue, updateQue)
    .then(()=>{
      console.log(`Item to save ${itemToSave.keyID}`);
    })
    .catch(err => console.log(err.message));
    setEditingIndex(-1);
    
  };
  
  const deleteQue = () => {
    setDelModal(true);
  };

  const deleteQueConfirm =(index)=>{
    setDelModal(false);
    // window.location.reload();
    const itemToSave = filteredQueue[index];
    const referenceQueue = ref(database, 'InqueTickets/'+itemToSave.keyID);
    remove(referenceQueue)
    .then(() => {
      fetchData();
      console.log(`Ticket with key ${index} was successfully deleted`);
    })
    .catch((error) => {
      console.log(`Error deleting data: ${error}`);
    });
  }
  // removable

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

  //removable
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
  //removable

  //status assigned:
  const [queueStatus2, setQueueStatus2] = useState([]);

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
        // Filter data here
        const filteredData = data.filter((item) => item.owner === email);
        setQueueStatus2(filteredData);
      });
    };

    fetchData();
  }, [email]); // Add 'email' to the dependency array

  //status assigned:

  //filter data
  const [searchText, setSearchText] = useState('');
  const handleSearch = (activeSearchText) => {
    if (activeSearchText.trim() === '') {
      setQueue(oldqueue);
    } else {
        const filteredUsers = queueTickets.filter(user =>
        user.name.toLowerCase().includes(activeSearchText.toLowerCase()) ||
        user.problemCategory.toLowerCase().includes(activeSearchText.toLowerCase())||
        user.date.toLowerCase().includes(activeSearchText.toLowerCase())||
        user.priority.toLowerCase().includes(activeSearchText.toLowerCase())
    );
       setQueue(filteredUsers);
    }
  };
  const handleSearchTextChange = (event) => {
    const activeSearchText = event.target.value;
    setSearchText(activeSearchText);
    handleSearch(activeSearchText);
  };
  //filter data

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


  //
  const [resolutionales, ratingsetusersAssigned] = useState([]);
  const ratingfetchDataAssigned = () => {
    const myreference = ref(database, 'Resolution');
    onValue(myreference, (snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        const keyID = childSnapshot.key; // Get the Firebase key (keyID) for each item
        data.push({ ...user, keyID });
      });
      ratingsetusersAssigned(data);
    });
  };
  useEffect(() => {
    ratingfetchDataAssigned();
  }, []);
  //

  //update rating
  const [feedback, setfeedback] = useState('');
  const handFeedback = (event) => {
    setfeedback(event.target.value);
  };
  const statusOptions = [1, 2, 3, 4, 5];
  const [status, setStatus] = useState(1); // Set the initial status value
  const handleStatusChange = (event) => {
    const selectedStatus = parseInt(event.target.value);
    setStatus(selectedStatus);
  };

  //
  const [renderFData, setrenderFData] = useState(-1)
  const [renderFDataTechnician, setrenderFDataTechnician] = useState(-1)
  const [deleteKeyRes, setdeleteKeyRes] = useState(-1);

  
  const dataToRenderFRating =(data, technician, delkey)=>{
    setrenderFData(data);
    setrenderFDataTechnician(technician);
    setdeleteKeyRes(delkey);
  }

  const updateDataInDatabase = (rating, fdback, resolution) => {
    const assignedQueueRef = ref(database, `Resolution/${deleteKeyRes}`); 
    const newData = {
      Rating: rating,
      Feedback: fdback,
    }
    update(assignedQueueRef, newData) //remove resolution, assigned
      .then(() => { 
        setrenderFData(-1);
      })
      .catch((error) => {
        console.error('Error updating data: ', error);
    });

    const dbRef = ref(getDatabase());
    const setResolved = ref(database, `Resolved/${deleteKeyRes}`); 

    get(child(dbRef, `AssignedQueue/${renderFData}`)).then((snapshot)=>{
      if(snapshot.exists()){
        const myData = snapshot.val().assigned_by_admin;
        const owner = snapshot.val().owner;
        const category = snapshot.val().problemCategory;
        const description = snapshot.val().problemdescription;
        const role = snapshot.val().role;
        const status = 'Resolved';
        const pProblem = snapshot.val().problem;
        const floor = snapshot.val().floor;
        const QueID = snapshot.val().keyID; 
        
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Month is 0-indexed
        const year = currentDate.getFullYear();
        const currentTime = currentDate.toLocaleTimeString();

//to remove
//TechniciansAssigned, Resolution
// not inQue agad: InqueTickets, add if else muna bafore exit
// AssignedQueue, comments
 
        const putData = {
          Admin: myData,
          TicketOwner: owner,
          Category: category,
          Description: description,
          Role: role,
          TicketStatus: status,
          Problem: pProblem,
          Floor: floor,
          TicketID: QueID,
          Resolution: resolution,
          Technician: renderFDataTechnician,
          Rating: rating,
          Feedback: fdback,
          DDay: day,
          MMonth: month,
          YYear: year,
          TTime: currentTime,
        }
        set(setResolved, putData).then(()=>{
          console.log('Nice : ', putData )
        })     
      }else{
        console.log("error");
      }
    })  
  };
   
  const [queue44, setqueue44] = useState(-1);
  return (

    <div id='inque'>
      <div id='inquetitle'>My Tickets {filteredQueue.length}</div>
      <div id="dflxsdsd">
        <input
         id='quesearch'
         type="search"
         placeholder='Search Queue'
         value={searchText}
         onChange={handleSearchTextChange}/>
         <div id="dflxsdsddflxsdsd">
          <button 
            onClick={()=>{setqueue44('Normal Ticket')}}
            id="quebtns">
            <div><RiGitPullRequestFill/></div>
            <div>Request</div>
          </button>
         </div>

         {queue44 === 'Normal Ticket' ? (<>
          <div id="flyflexssccum"> 
            <button id="flyflexssccumbtns" onClick={()=>{setqueue44(-1)}}>Close</button>
            <div id="flyflexssccum1">
              <NormalTicket />
            </div>
          </div>
         </>) : null }
      </div>
      <div id='inquetcontainer'>
        <>
        {filteredQueue.length > 0 ? (
            filteredQueue.map((data, index) => (
              <div id='queueticket' key={index}>
                <div id='quet'>
                 <div>Q00{count++}: {data.name}</div> 
                 <div>{data.priority}</div> 
                 <div id='btndiv3434' onClick={()=>{commentIndexter(data.keyID); openComment(index)}}>Chats</div>
                </div>
                {queueStatus2.map((quet, i) => (
                  quet.keyID === data.keyID && quet.status ? (
                    <div id='quet2' key={i}>
                      <div>Status: {quet.status}</div>
                      <div>Category: {data.problemCategory}</div>
                    </div>
                  ) : null
                ))}
                {/*  */}
                <>
                  <>
                  
                    
                  <div id='dog'>
                    {usersAssigned
                    .filter((assData) => assData.ticketID === data.keyID)
                    .map((assData, i) => (
                      <div id="flexassigned2323223" key={i}>
                        <div id="flexassigned232322" key={i}>
                          <div>
                            <VscVerifiedFilled />
                          </div>
                          <div>
                            <span>{assData.assignedEmpEm}</span>
                          </div>
                          <div id="queAss3232"><span>{assData.TicketStatus}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                 <div id="sh3e3aj343">
                 {resolutionales.map((rData, rdx)=>(
                      rData.TicketKeyID === data.keyID ? (<>
                        <div id='sh3e3aj34' key={rdx}>
                         <div id="sh3e3aj34s">Needs Feedback</div>
                         <div>
                          <span onClick={()=>{
                            const kKID = rData.TicketKeyID;
                            const technician = rData.Technician;
                            const delkey = rData.keyID;
                            dataToRenderFRating(kKID, technician, delkey)
                          }}>{rData.Technician}</span>
                         </div>
                        </div>
                    </>):(<></>)
                  ))} 
                 </div>   


                  {renderFData.length > 0 ? (<>
                    {resolutionales.map((rData, rdx)=>(
                      rData.TicketKeyID === renderFData && rData.Technician === renderFDataTechnician && rData.TicketKeyID === data.keyID ?  (<>
                       <div id='sh3e3aj3' key={rdx}>
                          <div>{rData.Technician}</div>
                            <div id='sjnsxjneu'>
                              <div>Resolution: {rData.Resolution}</div>
                                <div>
                                 <input
                                   type="text"
                                   id="textInput"
                                   placeholder='Feedback & Rating'
                                   value={feedback}
                                   onChange={handFeedback}/>
                                   <select name="status" value={status} onChange={handleStatusChange}>
                                     {statusOptions.map((option) => (
                                      <option key={option} value={option}>
                                       {option}
                                      </option>
                                     ))}
                                   </select>
                                 </div>
                                <div>
                                  <button onClick={()=>{
                                   const rating = status; 
                                   const fdback = feedback;
                                   const resolution = rData.Resolution;
                                   updateDataInDatabase(rating, fdback, resolution);
                                   }}>Send Feedback</button>
                                  <button onClick={()=>setrenderFData(-1)}>Close</button>
                                </div> 
                              </div>
                        </div>
                      </>):(<></>)
                    ))} 
                  </>):(<></>)}

                  {openC === index ? (<>
                      {liveChat.length >= 0 ? (<>
                        <div id='queFloatChats'>
                            <div id='commentcontainer029'>
                            {/*  */}
                            <div id="commentassined">
                              <div>
                                <div id='cmt83838'>
                                   <input type='text'
                                      id="comment"
                                      name="comment"
                                      placeholder="Live Chat..."
                                      value={comment}
                                      onChange={(event) => handleCommentChange(event.target.value)}
                                    />
                                  <div id="commentkflex">
                                    <button id="commentbtn444" onClick={() => {
                                      const  keyIDIndexter = data.keyID
                                      commentID(keyIDIndexter); 
                                      commentIndexter(data.keyID)}}> Chat</button>
                                    <button id="commentbtn444" onClick={()=>{
                                      commentIndexter(data.keyID); 
                                      closeComment()}}>Close</button>
                                    </div>
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
                                </>):(<>
                                  <div>
                                    No Chats yet
                                  </div>
                                </>)}
                              </div>
                            </div>
                            {/*  */}
                          </div>
                        </div>
                      </>):(<></>)}
                    </>):(<></>)}
                    
                      <div>
                        {editingIndex === index ? (
                          <div id="queFormEdit">    
                            <form>
                              <div>
                                <div>Edit Ticket</div>
                                <input
                                  type="text"
                                  placeholder="Title"
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div>
                                <textarea
                                  placeholder="Problem description"
                                  id="description"
                                  name="description"
                                  value={formData.description}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div id="normal-grid-ticket">
                                <div id="problem-category">
                                  <label htmlFor="problemCategory">Problem Category:</label>
                                  <br />
                                  <select
                                    id="problemCategory"
                                    name="problemCategory"
                                    value={formData.problemCategory}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Select a Category</option>
                                    {categories.map((category) => (
                                      <option key={category} value={category}>
                                        {category}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div id="priority">
                                  <label htmlFor="priority">Priority:</label>
                                  <br />
                                  <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Select a Priority</option>
                                    {priorities.map((priority) => (
                                      <option key={priority} value={priority}>
                                        {priority}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div id="priority">
                                  <label htmlFor="priority">Floors :</label>
                                  <br />
                                  <select
                                    id="floor"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {floors.map((flr) => (
                                      <option key={flr} value={flr}>
                                        {flr}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                              </div>
                            </form>
                            

                          {filteredUser.map((user) => (
                            <div id='btn-que' key={user.email}>
                              <>
                              <button onClick={() => saveQue(index, user.role)}>Save</button>
                              </>
                            </div>
                          ))}
        
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </>
                    <div id='btn-que'>
                      <button onClick={() => editQue(index)}>edit</button>
                      <button onClick={() => {
                        const hasMatchingTicket = usersAssigned.some(assData => assData.ticketID === data.keyID);
                        if (hasMatchingTicket) {
                            alert(`Can't delete queue item; it is already assigned.`);
                        } else {
                            deleteQue(index);
                        }
                      }}>Delete</button>

                      <button>{data.time} - {data.date}</button>
                    </div>
                    <>
                      {delModal === true && (
                        <div id='queModal'>
                          <div>Delete this Queue?</div>
                          <div id='btn-que'>
                            <button onClick={() => deleteQueConfirm(index)}>Yes</button>
                            <button onClick={() => setDelModal(false)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </>
                  </>
                {/*  */}
              </div>
            ))
          ) : (
            <div id="emptyQueueMessage">
             <div></div>
             <div>
              {emptyQueueMessage}
             </div>
            </div>
          )
        }
        </>
      </div>
    </div>
  )
}

export default Inque



