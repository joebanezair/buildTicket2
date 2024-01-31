import { FaStar } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import Moderator from '../../context/Moderator';
import { onValue, ref } from 'firebase/database';
import { database } from '../../firebase/firebase';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const KPITableView = () => {
  const { email } = Moderator(); 
  const [aquired, setAquired] = useState([]);
  const [oldqueue1, setOldQueue1] = useState([]);
  const [resolvedTodayCount, setResolvedTodayCount] = useState(0);

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

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; // Note: Months are zero-indexed
  const currentYear = currentDate.getFullYear();

  const filteredAcqs = aquired.filter((data) => data.Owner === email && data.Progress === 'Resolved');
  const filteredAcqsToday = aquired.filter((data) => 
    data.Owner === email &&
    data.Progress === 'Resolved' &&
    data.Day === currentDay &&
    data.Month === currentMonth &&
    data.Year === currentYear
  );

  const filteredAcqs2 = aquired.filter((data) => 
    data.Owner === email 
  );

  // Calculate weighted rating and count
  let totalWeightedRating = 0;
  let totalWeight = 0;
  let totalRating = 0;

  filteredAcqs.forEach((data) => {
    const rating = parseInt(data.Rating);
    const weight = rating === 5 ? 5 : rating === 4 ? 4 : rating === 3 ? 3 : rating === 2 ? 2 : rating === 1 ? 1 : 0;
    totalWeightedRating += rating * weight;
    totalWeight += weight;
    totalRating += rating;
  });

  const overallWeightedRating = totalWeight > 0 ? totalWeightedRating / totalWeight : 0;
  const overallRating = filteredAcqs.length > 0 ? totalRating / filteredAcqs.length : 0;

  return (
    <>
      <div>
        <div id='dviTable'>
          <table id='table-to-xls'>
            <thead>
              <tr>
                <th>Priority</th>
                <th>Name</th>
                <th>Progress</th>
                <th>Rating</th>
                <th>Stars</th>
              </tr>
            </thead>
            <tbody>
              {filteredAcqs.map((data, index) => (
                <tr key={index}>
                  <td><div>{data.Priority}</div></td>
                  <td><div id="TitleClickedKPI">{data.Name.slice(0, 10)}...</div></td>
                  <td><div>{data.Progress}</div></td>
                  <td><div>{data.Rating}</div></td>
                  <td><div id="dstars">
                    {data.Rating === '5' ? (<>
                      <FaStar /> 
                      <FaStar /> 
                      <FaStar /> 
                      <FaStar /> 
                      <FaStar /> 
                    </>) : data.Rating === '4' ? (<>
                      <FaStar /> 
                      <FaStar /> 
                      <FaStar /> 
                      <FaStar /> 
                    </>) : data.Rating === '3' ? (<>
                      <FaStar /> 
                      <FaStar /> 
                      <FaStar /> 
                    </>) : data.Rating === '2' ? (<>
                      <FaStar /> 
                      <FaStar /> 
                    </>) : data.Rating === '1' ? (<>
                      <FaStar /> 
                    </>) : null}
                  </div></td>
                </tr>
              ))}
              <tr>
                <td colSpan="4">Total Weighted Rating:</td>
                <td>{overallWeightedRating.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="4">Overall Rating:</td>
                <td>{overallRating.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="4">
                  {filteredAcqsToday.length > 0 ? (
                    <div>Resolved today: {filteredAcqsToday.length}</div>
                  ) : (
                    <div>No tickets resolved today</div>
                  )}
                </td>
                <td>
                  {filteredAcqsToday.length > 0 ? (
                    <div>{filteredAcqsToday.length}</div>
                  ) : (
                    <div>{filteredAcqsToday.length}</div>
                  ) }
                </td>
              </tr>
              <tr>
                <td colSpan="5">
                  <div>
                    {filteredAcqsToday.length + filteredAcqs2.length > 15 ? (
                      <div>Resolved {filteredAcqsToday.length + filteredAcqs2.length} you're performing well keep it up!</div>
                    ) : (
                      filteredAcqsToday.length + filteredAcqs2.length < 15 ? (
                        <div id="crimsons">Overall Resolved <span>{filteredAcqsToday.length + filteredAcqs2.length}</span>
                        </div>
                      ) : null
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="tablexls"
          sheet="tablexls"
          buttonText="Download XLS"
        />
      </div>
    </>
  );
};

export default KPITableView;
