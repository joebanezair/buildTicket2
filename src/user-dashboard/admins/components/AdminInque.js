import React, { useEffect, useState } from 'react'
import { onValue, push, ref, remove, set } from 'firebase/database';
import longteachers from '../../teachers/components/longteachers';
import { database } from '../../../firebase/firebase';
import Moderator from '../../../context/Moderator';
const priorities = ['High', 'Medium', 'Low'];

const AdminInque = () => {
  const [queueTickets, setQueue] = useState([]);
  const [filteredQueue, setFiltered] = useState([]);
  const { email } = Moderator();
  const  {emptyQueueMessage} = longteachers();
  const [editingIndex, setEditingIndex] = useState(-1);
  const [delModal, setDelModal] = useState(false);
  const [closeEdit, setcloseEdit] = useState(false);

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
       });
    };
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

  //dito nya nirerender yung data na galing sa database reflected
  //don sa mga dropdown, textarea, input,
  //pero yung data na na filtered then set don sa formData ex formData.floor
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

  //
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
  const saveQue = (index) => {
    const itemToSave = filteredQueue[index];
    const referenceQueue = ref(database, 'InqueTickets/'+itemToSave.keyID);
    const updateQue = {
      name: formData.name,
      description: formData.description,
      priority: formData.priority,
      problemCategory: formData.problemCategory,
      floor: formData.floor,
      owner: email,
      role: 'Admin',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    }
    set(referenceQueue, updateQue)
    .then(()=>{
      console.log(`Item to save ${itemToSave.keyID}`);
    })
    .catch(err => console.log(err.message));
    setEditingIndex(-1);
    setcloseEdit(false);
  };
  
  
  const openEdit =()=>{
    setcloseEdit(true);
  }
  const deleteQue = () => {
    setDelModal(true);
  };

  const deleteQueConfirm =(index)=>{
    setDelModal(false);
    window.location.reload();
    const itemToSave = filteredQueue[index];
    const referenceQueue = ref(database, 'InqueTickets/'+itemToSave.keyID);
    remove(referenceQueue)
    .then(() => {
      console.log(`Ticket with key ${index} was successfully deleted`);
    })
    .catch((error) => {
      console.log(`Error deleting data: ${error}`);
    });
  }
  // removable
   
  return (

    <div id='inque'>
      <div id='inquetitle'>In Queue:</div>
      <div id='inquetcontainerAdmin'>
        <>
        {filteredQueue.length > 0 ? (
            filteredQueue.map((data, index) => (
              <div id='queueticket' key={index}>
                <div id='quet'> 
                  <span id='qtitle' onClick={openEdit}>Q00{count++}:{data.name}</span> {``}<span id='qtitle'>{data.priority}</span> {``}
                </div>
                {closeEdit === true ? (
                // edit area 
                <>
                  <>
                  <div id='catfloor004'>
                    <span>{data.problemCategory}</span>
                  </div>
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
                          <div id='btn-que'>
                            <button onClick={() => saveQue(index)}>Save</button>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                  <div id='btn-que'>
                    <button onClick={() => editQue(index)}>edit</button>
                    <button onClick={() => deleteQue(index)}>delete</button>
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
                //edit area
                ) : (
                  <></>
                )}

               

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

export default AdminInque



