import { onValue, push, ref, remove, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { database } from '../../firebase/firebase';
import Moderator from '../../context/Moderator';
import longteachers from '../teachers/components/longteachers';

const AdminCategories = () => {
  const { email } = Moderator();
  const [categories, setCategories] = useState({
    high: { name: '' },
    medium: { name: '' },
    low: { name: '' },
  });

  const handleInputChange = (e, categoryType) => {
    const { name, value } = e.target;
    setCategories((prevCategories) => ({
      ...prevCategories,
      [categoryType]: {
        ...prevCategories[categoryType],
        [name]: value,
      },
    }));
  };

  const handlePostData = (categoryType) => {
    const category = categories[categoryType];
    const postData = {
      name: category.name,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      owner: email
    };

    const categoryRef = ref(database, `Category${categoryType}`);

    // Generate a unique key using 'push' and push the data to Firebase
    push(categoryRef, postData)
      .then(() => {
        console.log(`Data for ${categoryType} category posted to Firebase with a unique key`);
      })
      .catch((error) => {
        console.error(`Error posting data to Firebase: ${error}`);
      });

    // Clear the input field after posting
    setCategories((prevCategories) => ({
      ...prevCategories,
      [categoryType]: {
        name: '',
      },
    }));
  };

  const [category004, setcategory004] = useState('Default')
  const btnHighCat = () => {
    setcategory004('High')
  };
  const btnMediumCat = () => {
    setcategory004('Medium')
  };
  const btnLowCat =()=>{
    setcategory004('Low')
  }
  const btnDefault =()=>{
    setcategory004('Default')
  }

  return (
    <>
     <div id='displayCategories'>
        <div>
          <button onClick={btnHighCat}>High</button>
          <button onClick={btnMediumCat}>Medium</button>
          <button onClick={btnLowCat}>Low</button>
          <button onClick={btnDefault}>Default</button>
        </div>
        <div id='displayCategories004'>
        
        {category004 === 'Default' ? (
                <>
                 <div id='titleCat004'>Default: {` ${email} (Can edit the contents)`}</div>
                 <DefaultCategory004/>
                </>
            ) : category004 === 'High' ? (
                <>
                 <div id="title">
                    <label htmlFor="highCategory">Add High Categories</label>
                    <br/>
                    <input
                      type="text"
                      placeholder={`Post High Categories`}
                      id="highName"
                      name="name"
                      value={categories.high.name}
                      onChange={(e) => handleInputChange(e, 'high')}
                    />
                    <button onClick={() => handlePostData('high')}>Add</button>
                 </div>
                <div id='titleCat004'>High: {` ${email} (Can edit the contents)`}</div>
                <div id='scrollableCat'>
                  <HighCategory004 />
                </div>
                </>
            ) : category004 === 'Medium' ? (
                <>
                <div id="title">
                  <label htmlFor="mediumCategory">Add Medium Categories</label>
                  <br/>
                  <input
                    type="text"
                    placeholder={`Post Medium Categories`}
                    id="mediumName"
                    name="name"
                    value={categories.medium.name}
                    onChange={(e) => handleInputChange(e, 'medium')}
                  />
                  <button onClick={() => handlePostData('medium')}>Add</button>
                </div>
                <div id='titleCat004'>Medium: {` ${email} (Can edit the contents)`}</div>
                <div id='scrollableCat'>
                  <MediumCategory004 />
                </div>
                </>
            ) : category004 === 'Low' && (
                <>
                <div id="title">
                  <label htmlFor="lowCategory">Add Low Categories</label>
                  <br/>
                  <input
                    type="text"
                    placeholder={`Post Low Categories`}
                    id="lowName"
                    name="name"
                    value={categories.low.name}
                    onChange={(e) => handleInputChange(e, 'low')}
                  />
                  <button onClick={() => handlePostData('low')}>Add</button>
                </div>
                <div id='titleCat004'>Low: {` ${email} (Can edit the contents)`}</div>
                <div id='scrollableCat'>
                 <LowCategory004 />
                </div>
                </>
         )}

        </div>
     </div>
    </>
  );
};

export default AdminCategories;


const DefaultCategory004 = () => {
  const {longDefault} = longteachers();
    return (
      <div id='backearthcontainer'>
       <div id='backearth' />
       <div id='backearth1' >
        {longDefault}
       </div>
      </div>
    );
  }
  
const HighCategory004 = () => {
    const [categoryHigh, setCategoryHigh] = useState([]);
    let count = 0;
    for (let i = 0; i < categoryHigh.length; i++) {
      count++;
    }
    useEffect(() => {
      const fetchData = () => {
        const myReference = ref(database, 'Categoryhigh');
        onValue(myReference, (snapshot) => {
          const data = [];
          snapshot.forEach((childSnapshot) => {
            const catData = childSnapshot.val();
            const keyID = childSnapshot.key;
            data.push({ ...catData, keyID });
          });
          setCategoryHigh(data);
        });
      };
      fetchData();
    }, []);
  
    const updateDataName = (keyID, newName) => {
      const dataRef = ref(database, `Categoryhigh/${keyID}`);
      const updatedData = {
        name: newName,
      };
      update(dataRef, updatedData)
        .then(() => {
          alert(`Updated to ${newName}`);
        })
        .catch((error) => {
          alert(`Error updating data: ${error}`);
        });
    };
  
    const deleteData = (keyID) => {
      const dataRef = ref(database, `Categoryhigh/${keyID}`);
      remove(dataRef)
        .then(() => {
          console.log(`Data with key ${keyID} deleted`);
          // You may want to update your local state to reflect the deletion
          const updatedCategoryHigh = categoryHigh.filter((data) => data.keyID !== keyID);
          setCategoryHigh(updatedCategoryHigh);
        })
        .catch((error) => {
          console.error(`Error deleting data: ${error}`);
        });
    };
  
    return (
      <div>
         <>
          <div id='font12'>
           Total: {`${count}`}
          </div>
        </>
        {categoryHigh.length > 0 ? (
          categoryHigh.map((data, index) => (
            <div id="cat045" key={data.keyID}>
              <div id="cat0459">
                <div>
                 <input
                   type="text"
                   value={data.name}
                   onChange={(e) => {
                     // Update the data.name in the local state when the input value changes
                     const newName = e.target.value;
                     const updatedCategoryHigh = [...categoryHigh];
                     updatedCategoryHigh[index].name = newName;
                     setCategoryHigh(updatedCategoryHigh);
                   }}
                 />
                </div>
                
                <div>
                 <button id="cat0456">
                  {data.time} - {data.date}
                 </button>
                </div>

                <div>
                 <button
                  onClick={() => {
                    // Handle the save action by calling the updateDataName function
                    updateDataName(data.keyID, data.name);
                  }}
                 >
                  Save
                 </button>
                 <button 
                  onClick={() => {
                    deleteData(data.keyID);
                  }} id="cat04567"
                 >
                  Delete
                 </button>
                </div>

              </div>
            </div>
          ))
        ) : (
          <>
            No Data Available Yet
          </>
        )}
      </div>
    );
};

const MediumCategory004 = () => { // Change the component name to MediumCategory004
    const [categoryMedium, setCategoryMedium] = useState([]);
    let count = 0;
    for (let i = 0; i < categoryMedium.length; i++) {
      count++;
    }
    useEffect(() => {
      const fetchData = () => {
        const myReference = ref(database, 'Categorymedium'); // Change the reference to 'Categorymedium'
        onValue(myReference, (snapshot) => {
          const data = [];
          snapshot.forEach((childSnapshot) => {
            const catData = childSnapshot.val();
            const keyID = childSnapshot.key;
            data.push({ ...catData, keyID });
          });
          setCategoryMedium(data);
        });
      };
      fetchData();
    }, []);
  
    const updateDataName = (keyID, newName) => {
      const dataRef = ref(database, `Categorymedium/${keyID}`); // Change the reference to 'Categorymedium'
      const updatedData = {
        name: newName,
      };
      update(dataRef, updatedData)
        .then(() => {
          alert(`Updated to ${newName}`);
        })
        .catch((error) => {
          alert(`Error updating data: ${error}`);
        });
    };
  
    const deleteData = (keyID) => {
      const dataRef = ref(database, `Categorymedium/${keyID}`); // Change the reference to 'Categorymedium'
      remove(dataRef)
        .then(() => {
          console.log(`Data with key ${keyID} deleted`);
          const updatedCategoryMedium = categoryMedium.filter((data) => data.keyID !== keyID);
          setCategoryMedium(updatedCategoryMedium);
        })
        .catch((error) => {
          console.error(`Error deleting data: ${error}`);
        });
    };
  
    return (
      <div>
        <>
          <div id='font12'>
           Total: {`${count}`}
          </div>
        </>
        {categoryMedium.length > 0 ? (
          categoryMedium.map((data, index) => (
            <div id="cat045" key={data.keyID}>
              <div id="cat0459">
                <div>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const updatedCategoryMedium = [...categoryMedium];
                      updatedCategoryMedium[index].name = newName;
                      setCategoryMedium(updatedCategoryMedium);
                    }}
                  />
                </div>
                
                <div>
                  <button id="cat0456">
                    {data.time} - {data.date}
                  </button>
                </div>
  
                <div>
                  <button
                    onClick={() => {
                      updateDataName(data.keyID, data.name);
                    }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      deleteData(data.keyID);
                    }} id="cat04567"
                  >
                    Delete
                  </button>
                </div>
  
              </div>
            </div>
          ))
        ) : (
          <>
            No Data Available Yet
          </>
        )}
      </div>
    );
};

const LowCategory004 = () => {
    let count = 0;
    const [categoryLow, setCategoryLow] = useState([]);
    for (let i = 0; i < categoryLow.length; i++) {
      count++;
    }
    useEffect(() => {
      const fetchData = () => {
        const myReference = ref(database, 'Categorylow');
        onValue(myReference, (snapshot) => {
          const data = [];
          snapshot.forEach((childSnapshot) => {
            const catData = childSnapshot.val();
            const keyID = childSnapshot.key;
            data.push({ ...catData, keyID });
          });
          setCategoryLow(data);
        });
      };
      fetchData();
    }, []);
  
    const updateDataName = (keyID, newName) => {
      const dataRef = ref(database, `Categorylow/${keyID}`);
      const updatedData = {
        name: newName,
      };
      update(dataRef, updatedData)
        .then(() => {
          alert(`Updated to ${newName}`);
        })
        .catch((error) => {
          alert(`Error updating data: ${error}`);
        });
    };
  
    const deleteData = (keyID) => {
      const dataRef = ref(database, `Categorylow/${keyID}`);
      remove(dataRef)
        .then(() => {
          console.log(`Data with key ${keyID} deleted`);
          const updatedCategoryLow = categoryLow.filter((data) => data.keyID !== keyID);
          setCategoryLow(updatedCategoryLow);
        })
        .catch((error) => {
          console.error(`Error deleting data: ${error}`);
        });
    };
    
    return (
      <div>
        <>
          <div id='font12'>
           Total: {`${count}`}
          </div>
        </>
        {categoryLow.length > 0 ? (
          categoryLow.map((data, index) => (
            <div id="cat045" key={data.keyID}>
              <div id="cat0459">
                <div>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const updatedCategoryLow = [...categoryLow];
                      updatedCategoryLow[index].name = newName;
                      setCategoryLow(updatedCategoryLow);
                    }}
                  />
                </div>
                
                <div>
                  <button id="cat0456">
                    {data.time} - {data.date}
                  </button>
                </div>
  
                <div>
                  <button
                    onClick={() => {
                      updateDataName(data.keyID, data.name);
                    }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      deleteData(data.keyID);
                    }} id="cat04567"
                  >
                    Delete
                  </button>
                </div>
              </div>
             
            </div>
          ))
        ) : (
          <>
            No Data Available Yet
          </>
        )}
      </div>
    );
  };
  