import { child, onValue, push, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { database } from '../../../firebase/firebase';
import Moderator from '../../../context/Moderator';
const options = ['Category 1', 'Category 2', 'Category 3'];
const priorities = ['High', 'Medium', 'Low'];

const NormalTicket = () => {
  const { email } = Moderator();
  const [messageQue, setMessageQueue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    problemCategory: '',
    description: '',
    priority: 'Medium', // Default priority
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //
  //medium category removable
  const [selectedPriority, setSelectedPriority] = useState('Medium');  
  const [selectedFloor, setSelectedFloor] = useState('1st floor');  
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

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
  };

  const [selectedCategory, setSelectedCategory] = useState('Select Category'); 
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
  };

  useEffect(() => {
    let categoryNames = ['Select Category'];
    if (selectedPriority === 'Medium') {
      categoryNames = categoryMedium.map((item) => item.name);
    } else if (selectedPriority === 'High') {
      categoryNames = categoryHigh.map((item) => item.name);
    } else if (selectedPriority === 'Low') {
      categoryNames = categoryLow.map((item) => item.name);
    }
    setCategories(categoryNames);
  }, [selectedPriority, categoryMedium, categoryHigh, categoryLow]);
  //medium category removable
  //

  const QueTicket = ref(database, 'InqueTickets');
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const queData = {
      ...formData,
      owner: email, 
      role: `Faculty`,
      priority: selectedPriority,
      floor: selectedFloor,
      problemCategory: selectedCategory,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
  
    // Use push to generate a unique key for each entry
    const newTicketRef = push(QueTicket);
  
    set(newTicketRef, queData)
      .then(() => {
        setMessageQueue(`Ticket ${formData.name} was successfully queued for acknowledgement`);
      })
      .catch((error) => {
        setMessageQueue(`Error saving data: ${error}`);
      });
  
    setFormData({
      name: '',
      // problemCategory: '',
      description: '',
      // priority: 'Medium',
    });
  };
  const longMessage = `The MIS Admin will re-evaluate your requests, feedback will be sent after the ticket is acknowledged.`;

  return (
    <div id='normal-container'>
      <div id='normal-ticket'>
      <form onSubmit={handleSubmit}>
        <div id='title'>
          <div htmlFor="problemCategory">Create Ticket</div>
          <input
            type="text"
            placeholder={`Title`}
            id='name'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div id='description'>
          <textarea
            placeholder={`Problem description`}
            id='description'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div id='normal-grid-ticket'>
         <div id='problem-category'>
          <label htmlFor="problemCategory">Problem Category:</label>
          <br />
          <select value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>))}
          </select>
         </div>

        <div id='flexfloorpriority'>

           <div id='priority'>
            <label htmlFor="priority">Priority:</label><br />
            <select value={selectedPriority} onChange={handlePriorityChange}>
              {priorities.map((priority, index) => (
              <option key={index} value={priority}>
              {priority}
              </option>))}
            </select>
           </div>

           <div id='floor'>
            <label htmlFor="floor">Floor:</label><br />
            <select value={selectedFloor} onChange={handleFloorChange}>
              {floors.map((floor, index) => (
                <option key={index} value={floor}>
                  {floor}
                </option>
              ))}
            </select>
           </div>

         </div>

      </div>
        <button id='submit' type='submit'>Submit</button>
      </form>
      <div id='bottom-normal-text'>
        {!messageQue ? (<>{longMessage}</>): (<>{messageQue}</>)}
      </div>
      </div>
    </div>
  );
};

export default NormalTicket;
