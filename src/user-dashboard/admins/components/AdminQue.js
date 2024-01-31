import React, { useEffect, useState } from 'react';
import longteachers from '../../teachers/components/longteachers';
import { database } from '../../../firebase/firebase';
import { child, equalTo, get, onValue, orderByChild, query, ref, remove, set, update } from 'firebase/database';
import Moderator from '../../../context/Moderator';

const AdminQue =()=>{
    const {email} = Moderator();
    const [registeredUser, setRegistered] = useState([]);
    const [filteredUser, setFiltered] = useState([]);
    const [queueTickets, setQueue] = useState([]);
    const [loadPrevious, setLoadPrevious] = useState([]);
    const { emptyQueueMessage } = longteachers();

    const [selectedPriority, setSelectedPriority] = useState('Medium');  
    const priorities = ['High', 'Medium', 'Low'];
    const [selectedStatus, setSelectedStatus] = useState('Assigned'); 
    const statuses = ['Assigned', 'Cherry Picked'];
    const handleStatusChange = (e) => {
      setSelectedStatus(e.target.value);
    };
    const [selectedCategory, setSelectedCategory] = useState('Select Category');  

    //registered users
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
       const filteredUsers = registeredUser.filter((user) => user.role === 'Technician');
       setFiltered(filteredUsers);
      }
    }, [registeredUser]);
    //formData
    const [formData, setFormData] = useState({
      problemCategory: '',
      priority: 'Medium', // Default priority
    });
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
    //formData
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

     

    //save assigned fetch again the data from the assigned
    const helloTechnician =(stNo, stEm, indx)=>{
      const dataNo = stNo +''+ indx;
      const queueProcess = {
         ticketID: indx,
         assignedEmpNo: stNo,
         assignedEmpEm: stEm,
         TicketStatus: 'Queued'
      }
      const referenceQueue = ref(database, `TechniciansAssigned/${dataNo}`);
      set(referenceQueue, queueProcess)
      .then(()=>{ console.log(`Item to save ${indx}`); })
      .catch(err => console.log(err.message));
    }

    //save assigned
  
     
    //removable
    const [editAdminQue, setEditAdminQue] = useState(-1);
    const showEditQueue =(index)=>{
      setEditAdminQue(index);
      const myQueue = queueTickets[index];
      setFormData({
        floor: myQueue.floor,
        problemCategory: myQueue.problemCategory,
        priority: myQueue.priority,
      });
    }

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

    const byeTechnician =(key)=>{
      const referenceQueue = ref(database, `TechniciansAssigned/${key}`); 
      remove(referenceQueue)
      .then(() => {
        console.log(`Removed: `+key);
        fetchDataAssigned();
      })
      .catch((error) => {
        console.log(`Error deleting data: ${error}`);
      });
    }
    //removable
    
    const saveTicket = (index) => {
      if (selectedStatus === 'Cherry Picked') {
        if (selectedStatus === "") {
          alert('One or more required fields are empty.');
        } else if (
          selectedStatus == null  
        ) {
          alert('One or more variables are null or undefined.');
        } else {
          const queueProcess = {
            status: selectedStatus,
            prioritylevel: formData.priority,
            problemCategory: formData.problemCategory,
            problem: queueTickets[index].name,
            floor: formData.floor,
            owner: queueTickets[index].owner,
            keyID: queueTickets[index].keyID,
            problemdescription: queueTickets[index].description,
            role: queueTickets[index].role,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            assigned_by_admin: email,
          };
          const referenceQueue = ref(database, 'CherryPicked/'+queueTickets[index].keyID);
          set(referenceQueue, queueProcess)
          .then(()=>{
            console.log(`Item to save ${queueTickets[index].keyID}`);
          })
          .catch(err => console.log(err.message));
          setEditAdminQue(-1);
        }
      } else {
        if (
          selectedStatus == null 
        ) {
          alert('One or more variables are null or undefined.');
        } else if (
          selectedStatus === ""  
        ) {
          alert('One or more required fields are empty.');
        } else {
          const queueProcess = {
            status: selectedStatus,
            prioritylevel: formData.priority,
            problemCategory: formData.problemCategory,
            floor: formData.floor,
            problem: queueTickets[index].name,
            owner: queueTickets[index].owner,
            problemdescription: queueTickets[index].description,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            keyID: queueTickets[index].keyID,
            role: queueTickets[index].role,
            assigned_by_admin: email,
          };
       
          const referenceQueue = ref(database, 'AssignedQueue/'+queueTickets[index].keyID);
          set(referenceQueue, queueProcess)
          .then(()=>{
            console.log(`Item to save ${queueTickets[index].keyID}`);
          })
          .catch(err => console.log(err.message));
          setEditAdminQue(-1);
        }
      }
    }
    
    const closeTicket =(index)=>{
      setSelectedPriority('');
      setSelectedStatus('');
      setSelectedCategory('');
      setEditAdminQue(-1);
    }

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
      let categoryNames = ['Select Category'];
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
    
    //registered users
    let count = 0;
    useEffect(() => {
      const fetchData = () => {
        const myreference = ref(database, 'InqueTickets');
        onValue(myreference, (snapshot) => {
          const data = [];
          snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const keyID = childSnapshot.key; // Get the Firebase key (keyID) for each item
            data.push({ ...user, keyID });
          });
          setQueue(data);
          setLoadPrevious(data);
        });
      };
      fetchData();
    }, []);
    for (let i = 0; i < queueTickets.length; i++) {
      count++;
    }
    const [descCripQue, setdescriptQue] = useState([-1]);
    const showDescription = (index) => {
      setdescriptQue(index)
    }
    const closeDescription = () => {
      setdescriptQue(-1);
    }

    //reject Queue
    const [delModal, setDelModal] = useState(false);
    const rejectQueue = (indx, keyPi) => {
      const ToReject = {
        problemCategory: queueTickets[indx].problemCategory,
        role: queueTickets[indx].role,
        priority: queueTickets[indx].priority,
        name: queueTickets[indx].name,
        owner: queueTickets[indx].owner,
        floor: queueTickets[indx].floor,
        description: queueTickets[indx].description,
        date: queueTickets[indx].date,
        time: queueTickets[indx].time,
        rejected_by: email,
      }
   
      const referenceQueue = ref(database, 'RejectedQueue/'+keyPi);
      set(referenceQueue, ToReject)
      .then(()=>{
        console.log(`Item to save`);
      })
      .catch(err => console.log(err.message));
      const removereferenceQueue = ref(database, 'InqueTickets/'+keyPi);
      remove(removereferenceQueue).then(()=>{
        alert('removed Queue');
      })
      setDelModal(false)
     
    };
    //reject Queue
    

    //removable
    const [searchQueue, setSearchQueue] = useState('');
    const handleSearchQue = (activeSearchText) => {
      if (activeSearchText.trim() === '') {
        setQueue(loadPrevious);
      } else {
        const filteredQueue = queueTickets.filter(item =>
          item.role.toLowerCase().includes(activeSearchText.toLowerCase())||
          item.owner.toLowerCase().includes(activeSearchText.toLowerCase())||
          item.name.toLowerCase().includes(activeSearchText.toLowerCase())||
          item.priority.toLowerCase().includes(activeSearchText.toLowerCase())
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

    return(<>
    <div id='queAdminContainer'>
        <div id='flexFilter'>
          <div id="priority">
          <input
          type="search"
          placeholder='Search Queue'
          value={searchQueue}
          onChange={handleSearchQueue}/>
          </div>
        </div>
        <div id='flexFilterss3'> 
          In Que: {count}
        <div id='RoleFilter'> {/*Filter: Role Priority*/}
      </div>
        </div>
          <div id='quedminQueue'>
           <div id='quedminQueue1'>
            <div id='quedminQueue2'>
              {queueTickets.length > 0 ? (
                queueTickets.map((data, index) => (
                  <div id='queDmin' key={index}>
                    <div id="quet">
                      <div id='qtitle'>{data.role}Q00{count++}: {data.name}</div> 
                      <div id='qtitle'>{data.priority}</div> 
                    </div>
                  <>
                    <div id='queDesc004'>
                      <div>
                        {data.owner} 
                      </div>
                    </div>
                    {editAdminQue === index ? (
                      <div id='setQue'>
                        <div id='flexAdminQue'>
                          <div id='status-container'>
                            <div>
                              <select value={selectedStatus} onChange={handleStatusChange}>
                              {statuses.map((status, index) => (
                                <option key={index} value={status}>
                                  {status}
                                </option>
                              ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div id='midsj'>
                          <ul>
                            <li>Category: {data.problemCategory}</li>
                            <li>Priority: {data.priority}</li>
                            <li>Floor: {data.floor}</li>
                          </ul>
                        </div>

                        <div id='technicians-container'>
                        {selectedStatus === 'Cherry Picked' ? (<>
                        </>): 
                        (<>
                          <div>
                            <label>Technicians: </label>
                            <div id='flexTechQue232'>
                              <div>
                                {filteredUser.map((technician, i) => {
                                  return (
                                    <div id='technicianselect02020' key={i}>
                                      <div>
                                        <button onClick={()=>{
                                          const stNo = technician.studentNo;
                                          const stEm = technician.email;
                                          const indx = data.keyID;
                                          helloTechnician(stNo, stEm, indx)
                                        }}>add</button>
                                      </div>
                                      <div>
                                        <span id='emailSpan'>{`${technician.email}`}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div>
                                {usersAssigned.map((assData, i)=>(
                                  assData.ticketID === data.keyID ? (<>
                                    <div id='technicianselect02020' key={i}>
                                      <div>
                                        <button
                                        id='btndel0202'
                                        onClick={()=>{
                                          const keyID = assData.keyID;
                                          byeTechnician(keyID)
                                        }}
                                        >remove</button>
                                      </div>
                                      <div>
                                        <span id='emailSpan'>{assData.assignedEmpEm}</span>
                                      </div>
                                    </div>
                                  </>) : (<></>) 
                                ))}
                              </div>
                            </div>
                          </div>
                        </>)}
                          
                        </div>
                        <div id='NewKPI'>
                          <button onClick={() => saveTicket(index)}>Save</button>
                          <button onClick={() => closeTicket(index)}>Close</button>
                        </div>
                      </div>
                    ):(<></>)}
                    
                    {descCripQue === index? (<>
                    <div id='queDescript0045'>
                      <label>Description:<br/><span>Time: {data.time}- Date: {data.date}</span></label>
                      <div id='queDescript00456'>
                        {data.description}
                      </div>
                      <div>
                        <button onClick={() => closeDescription()}>Close</button>
                      </div>
                    </div>
                    </>):(<></>)}

                      <div id='btnadque'>
                        <button onClick={()=> showDescription(index)}>Description</button>
                        <button onClick={()=> showEditQueue(index)}>Assign</button>
                        <button onClick={() => {
                          const hasMatchingTicket = usersAssigned.some(assData => assData.ticketID === data.keyID);
                          if (hasMatchingTicket) {
                            alert('Can\'t delete\nPlease remove the assigned Technicians');
                          } else {
                            setDelModal(true);
                          }
                        }}>Reject</button>

                        <button>{data.time} - {data.date}</button>
                      </div>

                      <>
                        {delModal === true && (
                          <div id='queModal'>
                            <div>Reject this Queue?</div>
                              <div id='btn-queID'>
                               <button onClick={() =>{
                                 const keyPi = data.keyID;
                                 const indx = index;
                                 rejectQueue(indx, keyPi)
                               }}>Yes</button>
                               <button onClick={() => setDelModal(false)}>Cancel</button>
                             </div>  
                          </div>
                        )}
                      </>

                    </>
                    </div>
                  ))
                ) : (
              <div>
                <div></div>
                <div>{emptyQueueMessage}</div>
              </div>
              )}
            </div>
            </div>
        </div>
      </div>
    </>)
}

export default AdminQue