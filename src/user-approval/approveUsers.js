import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase/firebase';
import { child, get, onValue, ref, remove, set } from 'firebase/database';
import { FaUserCheck } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';

const ConfirmUsers = () => {
  let count = 0;
  const {signup} = useAuth();
  const currentDate = new Date();
  const [confirmUsers, setConfirmUsers] = useState([]);
  const [confirmload, setConfirmload] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = () => {
    const myreference = ref(database, 'ConfirmSignees');
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
  useEffect(() => {
    fetchData();
  }, []);
  // Roles
  const [selectedRoles, setSelectedRoles] = useState(['']);
  const handleRoleSelect = (index, role) => {
    const newSelectedRoles = [...selectedRoles];
    newSelectedRoles[index] = role;
    setSelectedRoles(newSelectedRoles);
  };
  // Roles
  const approveUsers = async (index) => {
    const user = confirmUsers[index];
    const role = selectedRoles[index];
    if (role === "") {
      alert("Please define a role.");
      return;
    }
    const studentNoToCheck = user.studentNo;
    const registerUserRef = ref(database, 'RegisteredUsers');
    get(child(registerUserRef, studentNoToCheck))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setError("Account already exists");
          alert("Account already exists");
        } else {
          const registerData = {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            studentNo: user.studentNo,
            password: user.password,
            date: currentDate.toLocaleDateString(),
            time: currentDate.toLocaleTimeString(),
            role,
            status: 'Activated',
          };
          signup(registerData.email, registerData.password)
          .then(() => {
            set(child(registerUserRef, studentNoToCheck), registerData)
            .then(() => {
              remove(ref(database, `ConfirmSignees/${studentNoToCheck}`))
              .then(() => {
                  alert('Account is now registered');
                  console.log(studentNoToCheck + ' removed from confirmation');
                  fetchData();
              });
            })
            .catch((err) => {
              console.log(err);
            });
          })
          console.log(registerData);
        }
      });
  };

  const removeUsers = (index) => {
    if (index >= 0 && index < confirmUsers.length) {
      const user = confirmUsers[index];
      const userRef = ref(database, `ConfirmSignees/${user.keyID}`);
      remove(userRef)
        .then(() => {
          console.log(user.keyID + ' removed from confirmation');
          fetchData();
        })
        .catch(error => {
          console.error('Error removing user:', error);
        });
    }
  };
  
  //removable
  const [searchText, setSearchText] = useState('');
  const handleSearch = (activeSearchText) => {
    if (activeSearchText.trim() === '') {
      setConfirmUsers(confirmload);
    } else {
      const filteredUsers = confirmUsers.filter(user =>
        user.name.toLowerCase().includes(activeSearchText.toLowerCase()) ||
        user.email.toLowerCase().includes(activeSearchText.toLowerCase())
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

  return (
    <>
      <div id='approve-main-container'>
       <div id='search-bar'>
          <input
            type="search"
            placeholder='Search registrants'
            value={searchText}
            onChange={handleSearchTextChange}
          />
          <button onClick={() => handleSearch(searchText)}>Search</button>
        </div>

       <div id='approve-title'>
        <div>
          <FaUserCheck />
        </div>
        <div>
          Approve Registrants: {count}
        </div>
       </div>
       <div id='approve-grid'>
         {confirmUsers.length === 0 ? (
              <div id='no-registrants'>
                <div>
                  No registrants to display.
                </div>
              </div>
            ) : (
              confirmUsers.map((users, index) => {
                return (
                  <div id='approve-container' key={index}>
                    <div>
                      <div>
                        <div>Name: {users.name}</div>
                        <div>Last Name: {users.lastName}</div>
                      </div>
                      <div>
                        <div>Email: {users.email}</div>
                        <div>Student No#: {users.studentNo}</div>
                      </div>
                      <div>
                        <div>Date: {users.date} - {users.time} </div>
                      </div>
                      <div>Password: {users.password}</div>
                    </div>
                    <div>
                      <select
                        value={selectedRoles[index]}
                        onChange={(e) => handleRoleSelect(index, e.target.value)}
                      >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Technician">Technician</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
                    <div id='btn-approve'>
                      <button onClick={() => approveUsers(index)}>Approve</button>
                      <button onClick={() => removeUsers(index)}>Remove</button>
                    </div>
                  </div>
              );
            })
          )}
       </div>
      </div>
    </>
  );
};

export default ConfirmUsers;



