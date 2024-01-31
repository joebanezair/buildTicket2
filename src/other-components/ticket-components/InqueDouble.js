 
import React, { useEffect, useState } from 'react'
import { child, get, getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database';
import Moderator from '../../context/Moderator';
import { database } from '../../firebase/firebase';
const priorities = ['High', 'Medium', 'Low'];

const InqueDouble = () => {
  const [queueTickets, setQueue] = useState([]);
  const [oldqueue, setoldqueue] = useState([]);
  const { email } = Moderator();
  const [filteredQueue, setFiltered] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [filteredUser, setFiltered2] = useState([]);
  const [registeredUser, setRegistered] = useState([]);

  //removable
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

  const editQue = (index, indexMe) => {
    setEditingIndex(index);
    setFormData({
      problemCategory: indexMe.Category,
      description: indexMe.Description,
      priority: indexMe.Priority,
      floor: indexMe.Floor,
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
  const saveQue = (saveData) => {
    const referenceQueue = ref(database, 'InqueTickets/' + saveData.KeyID); 
    const updateQue = {
      priority: formData.priority,  
      problemCategory: formData.problemCategory,
      floor: formData.floor,
      name: saveData.Name,
      description: saveData.Description,
      owner: saveData.Owner,
      role: saveData.Role,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      updated_by: email,
    };
  
    set(referenceQueue, updateQue)
      .then(() => {
        alert(`Updated : ${saveData.KeyID}`);  
        fetchData();
      })
      .catch((err) => console.log(err.message));
    setEditingIndex(-1);
  };


  const AquireQueue = (saveData) => {
    const referenceQueue = ref(database, 'AquiredTickets/' + saveData.KeyID); 
    const toRemove = ref(database, 'InqueTickets/' + saveData.KeyID); 
    alert(''+saveData.Problem)

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const time = new Date().toLocaleTimeString();
    const myData = {
      KeyID: saveData.KeyID,
      Priority: saveData.Priority,
      Category: saveData.Category,
      Role: saveData.Role,
      Description: saveData.Description,
      Name: saveData.Problem,
      Progress: 'Aquired',
      Owner: saveData.Owner,
      AquiredBy: email,
      Resolution: 'N/A',
      FeedBack: '',
      Rating: '',
      Day: day,
      Month: month,
      Year: year,
      Time: time
    } 
    set(referenceQueue, myData)
      .then(() => {
        remove(toRemove);
        fetchData();
      })
      .catch((err) => console.log(err.message));
    setEditingIndex(-1);
  };
  

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
        user.priority.toLowerCase().includes(activeSearchText.toLowerCase()) ||
        user.role.toLowerCase().includes(activeSearchText.toLowerCase())
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

  const [checkID, setCheckID] = useState(-1);
  const forHigh = queueTickets.filter((data) => data.priority === 'High');
  const forLow = queueTickets.filter((data) => data.priority === 'Low');
  const forMed = queueTickets.filter((data) => data.priority === 'Medium');
  // const [modalYes, setmodalYes] = useState(-1);

return (<>
    <div id="containerDfx">
      <div>
        <div id="searchInpt33">
            <div>
              <input
                id='quesearch'
                type="search"
                placeholder='Search Queue'
                value={searchText}
                onChange={handleSearchTextChange}/>
            </div>
            <div>All Tickets {queueTickets.length}</div>
        </div>

        <div id="legendpfx">
          <div id="tlt3LegendM1">
           <div id="prHigh" />
           <div>{forHigh.length} - High</div>
          </div>
          <div id="tlt3LegendM2">
           <div id="prMed" />
           <div>{forMed.length} - Medium</div>
          </div>
          <div id="tlt3LegendM3">
           <div id="prLow" />
           <div>{forLow.length} - Low</div>
          </div>
        </div>

        <div id="toAquire"> 
          {queueTickets.length > 0 ? (<>
            {queueTickets.map((queData, index)=>(
              <div id="containertoAquire" 
               onClick={()=>{
                const MyKey = queData.keyID;
                setCheckID(MyKey);
               }}
               key={index}>
                <div id="dviPad">
                  {queData.priority === "High" ? (<>
                    <div id="prHigh" />
                    </>) :
                    queData.priority === "Medium" ? (<>
                    <div id="prMed" />
                    </>) :
                    queData.priority === "Low" ? (<>
                    <div id="prLow" />
                  </>) :
                  null}
                </div>
                <div id="containertitle">
                  {queData.name.slice(0, 10)}...
                </div>
              </div>
            ))}
          </>):null}
        </div>
      </div>
      <div id="ticketDataInformation">
        {checkID.length > 0 ? (<>
          {queueTickets.map((queData, index)=>
          queData.keyID === checkID ? (<>
            <div key={index} id="Title34343">
              <div id="probTRender"> {queData.priority === "High" ? (<>
                    <span id="sp3high">Problem: {queData.name}</span> <span id="sp3high">level: {queData.priority}</span>
                    </>) :
                    queData.priority === "Medium" ? (<>
                    <span id="sp3med">Problem: {queData.name}</span> <span id="sp3med">level: {queData.priority}</span>
                    </>) :
                    queData.priority === "Low" ? (<>
                    <span id="sp3low">Problem: {queData.name}</span> <span id="sp3low">level: {queData.priority}</span>
                  </>) :
                  null}
              </div>
              <div id="acDataCon">
                <div><label>Floor:</label> {queData.floor}</div>
                <div><label>Description:</label> <br/> {queData.description}</div>
                <div><label>Category:</label> {queData.problemCategory}</div>
                <div id="techni343sj"><span>From a {queData.role}</span>{' ' + queData.owner}</div>
                <div id="btnEditHov">
                  <button onClick={()=>{
                    const category = queData.problemCategory;
                    const floor = queData.floor;
                    const description = queData.description;
                    const priority = queData.priority;
                    const indexMe = {
                      Category: category,
                      Floor: floor,
                      Description: description,
                      Priority: priority
                    }
                    editQue(index, indexMe)
                    }}>
                    Edit
                  </button>
                  {editingIndex === index ? (<>
                    <button onClick={()=>{
                      setEditingIndex(-1)
                      }}>
                      Close
                    </button>
                  </>) : null}
                </div>

                {editingIndex === index ? (
                 <div id="Queiste39r3">    
                   <form>
                     <div id="normal-grid-ticket">                           
                        <div id="flex93jd9">
                         <div id="priority">
                           <label htmlFor="priority">Priority:</label>
                            <br />
                           <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            required>
                            <option value={formData.priority}>{formData.priority}</option>
                             {priorities.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>))}
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
                              required>
                             {floors.map((flr) => (
                             <option key={flr} value={flr}>
                               {flr}
                             </option> ))}
                            </select>
                         </div>
                        </div>
                        <div id="problem4category">
                          <label htmlFor="problemCategory">Problem Category:</label>
                          <br />
                            <select
                              id="problemCategory"
                              name="problemCategory"
                              value={formData.problemCategory}
                              onChange={handleInputChange}
                              required >
                              <option value={formData.problemCategory}>{formData.problemCategory}</option>
                                {categories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option> ))}
                            </select>
                         </div>
                      </div>
                       </form>

                       <div id="btnSaveClickie">
                        <button onClick={() => {
                            const KID = queData.keyID;
                            const priority = queData.priority;
                            const category = queData.problemCategory;
                            const description = queData.description;
                            const floor = queData.floor;
                            const role = queData.role;
                            const name = queData.name;
                            const owner = queData.owner;
                            const saveQueueData = {
                              KeyID: KID,
                              Priority: priority,
                              Category: category,
                              Floor: floor,
                              Role: role,
                              Owner: owner,
                              Name: name,
                              Description: description
                            }
                            saveQue(saveQueueData)
                          }}>Save</button>
                       </div>
                       
                </div>
              ) : null }

              </div>
              <div id="btnAquire">
                <button onClick={()=>{ 
                  const KkeyID = queData.keyID;
                  const yesAquire = {
                    KeyID: KkeyID,
                    Priority: queData.priority,
                    Category: queData.problemCategory,
                    Floor: queData.floor,
                    Problem: queData.name,
                    Description: queData.description,
                    Role: queData.role,
                    Owner: queData.owner,
                  };
                  AquireQueue(yesAquire)
                  }}>
                  <div>+</div>
                  <div>Aquire</div>
                </button>
              </div>

              <div id="btnCloseheue">
                <button onClick={()=>{ setCheckID(-1)}}>Close</button>
                <button>{'Time: ' + queData.time + ' Date: ' + queData.date}</button>
              </div>
            </div>

          </>) : null)}
        </>) : null}
      </div>
    </div>

    
  </>)
}

export default InqueDouble



