import React, { useEffect, useState } from 'react'
import Login from './login'
import Signup from './signup'
import NavigationDashboard from '../other-components/dashboard-navigation/NavigationDashboard'
import { onValue, ref } from 'firebase/database'
import { database } from '../firebase/firebase'

const Logsign = () => {
  //removable
  let count = 0;
  const [confirmUsers, setConfirmUsers] = useState([]);
  const [confirmload, setConfirmload] = useState([]);
  
  useEffect(() => {
    const fetchData = () => {
      const myreference = ref(database, 'RegisteredUsers');
      const data = [];
      onValue(myreference, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const users = childSnapshot.val();
          const keyID = childSnapshot.key;
          data.push({
            ...users,
            keyID
          });
        });
        setConfirmUsers(data);
        setConfirmload(data);
      });
    };
    fetchData();
  }, []);

  const [searchText, setSearchText] = useState('');
  const handleSearch = (activeSearchText) => {
    if (activeSearchText.trim() === '') {
      setConfirmUsers(confirmload);
    } else {
      const filteredUsers = confirmUsers.filter(user =>
        user.name.toLowerCase().includes(activeSearchText.toLowerCase()) ||
        user.email.toLowerCase().includes(activeSearchText.toLowerCase())||
        user.studentNo.toLowerCase().includes(activeSearchText.toLowerCase())||
        user.role.toLowerCase().includes(activeSearchText.toLowerCase())
      );
      setConfirmUsers(filteredUsers);
    }
  };
  
  const handleSearchTextChange = (event) => {
    const activeSearchText = event.target.value;
    setSearchText(activeSearchText);
    handleSearch(activeSearchText);
  };

  confirmUsers.length > 0 && confirmUsers.forEach(() => {
    count++;
  });

  const [openField, closeField] = useState(false);
  const btnLogOpen = () => {
    closeField(false);
  };
  const btnSignOpen = () => {
    closeField(true);
  };
  //removable
  return (<>
    <div>
    <div>
     <NavigationDashboard/>
    </div>
    
    <div id='griddie003'>
    <div>
      <div id='griddie0034'>
        <button onClick={btnLogOpen}>Login</button>
        <button onClick={btnSignOpen}>Signup</button>
      </div>
      <div id='grid-logsign'>
        {!openField === true ? <>
          <div>
            <Login/>
          </div>
        </> : <>
          <div>
            <Signup/>
          </div>
        </>}
      </div>
    </div>
    <div id='registered-users'>
      <div>
        <input
         type="search"
         placeholder='Search registrants'
         value={searchText}
         onChange={handleSearchTextChange}/>
        <button onClick={() => handleSearch(searchText)}>Search</button>
      </div>
      <div id='useregtitle'>
        Users: {count}
      </div>

      <div id='flexCard'>
        {confirmUsers.length === 0 ? (
        <div id='no-registrants'>
          <div>
            No registrants to display.
          </div>
        </div>
        ) : (
        confirmUsers.map((users, index) => {
        return (
        <div id='card-registered' key={index}>
        <div>
          <div>
          <div>Name: {users.name} {users.lastName}</div>
          </div>
          <div>
          <div>Email: {users.email}</div>
          <div>
            {users.role}: {users.studentNo}</div>
          </div>
          {/* <div>
            {users.password}
          </div> */}
        </div>
        </div>
        );}))}
      </div>
    </div>
    </div>

    </div>
  </>)
}

export default Logsign