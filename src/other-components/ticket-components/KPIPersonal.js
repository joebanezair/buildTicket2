import { BiCalendar } from "react-icons/bi";
import { HiTicket, HiStar } from "react-icons/hi";
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { database } from '../../firebase/firebase';
import Moderator from '../../context/Moderator';

const KPIPersonal = () => {
    const {email} = Moderator();
    //
    const [resolved, setresolved] = useState([]); 
    const [oldqueue, setoldqueue] = useState([]); 
    const [viewIndex, setviewIndex] = useState(-1); 
    let count = 1;
    const ratingfetchDataAssigned = () => {
      const myreference = ref(database, 'Resolved');
      onValue(myreference, (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val();
          const keyID = childSnapshot.key; // Get the Firebase key (keyID) for each item
          data.push({ ...user, keyID });
        });
        setresolved(data)
        setoldqueue(data)
      });
    };
    useEffect(() => {
      ratingfetchDataAssigned();
    }, []);
    //

  //analytics
  const filterRatings = (rating, email) => {
    return resolved.filter(
      (data) => data.Rating === rating && data.Technician === email
    ).length;
  };
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= rating; i++) {
      stars.push(<HiStar key={i} />);
    }
    return stars;
  }; 
  const calculateWeightedRating = (resolved, email) => {
    const ratingCounts = {};
    resolved.forEach((data) => {
      if (data.Technician === email) {
        const rating = data.Rating;
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
      }
    });
    let weightedSum = 0;
    let totalCount = 0;
    for (const rating in ratingCounts) {
      const count = ratingCounts[rating];
      weightedSum += rating * count;
      totalCount += count;
    }
    const weightedRating = totalCount === 0 ? 0 : weightedSum / totalCount;
    return weightedRating;
  };
  const weightedRating = calculateWeightedRating(resolved, email);
 
 
 
  //analytics
  const [selectedDay, setSelectedDay] = useState(-1);
  const [selectedMonth, setSelectedMonth] = useState(-1);
  const [selectedYear, setSelectedYear] = useState(-1);
  const currentYear = new Date().getFullYear();

  const handleDay = (e) => {
    const day = e.target.value;
  
    if (day !== "0") {
      setSelectedDay(day);
  
      const filterR = resolved.filter(
        (data) => data && data.length > 0 && data.DDay === parseInt(day) && data.Technician === email
      );
  
      setresolved(filterR);
    } else {
      // If "0" is selected, reset to the original resolved array
      setresolved(oldqueue);
    }
  };
  
  const handleMonth = (e) => {
    const mt = e.target.value;
    if (mt !== "0") {
      setSelectedMonth(mt);
      const filterR = resolved.filter(
        (data) => data && data.length > 0 && data.MMonth === parseInt(mt) && data.Technician === email
      );
  
      setresolved(filterR);
    }
  };
  
  const handleYear = (e) => {
    const yr = e.target.value;
    if (yr !== "0") {
      setSelectedYear(yr);
      const filterR = resolved.filter(
        (data) => data && data.length > 0 && data.YYear === parseInt(yr) && data.Technician === email
      );
  
      setresolved(filterR);
    }
  };
  

  return (<>
    <div id="hs343">
      <div id="jsjjasan">Resolved Tickets</div>
        <div id="ddhtsjc3">
          <div>
              <label>
                Day:
                <select value={selectedDay} onChange={(e)=>{
                  setSelectedDay(-1)
                  handleDay(e)}}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Month:
                <select value={selectedMonth} onChange={(e)=>{handleMonth(e)}}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Year:
                <select value={selectedYear} onChange={(e) => {handleYear(e)}}>
                  {Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
          </div>
        </div> 

 

      <div id='bksresolvedsfix'>
        <div id="ddsfsx">
          {resolved.map((data, index)=>(
            data.Technician === email && resolved.length > 0 ? (<>
            <div id='bksresolved' key={index}>
              <div id='bksresolvedbksresolved'>
                <div id='bksresolvedttl' onClick={()=>{setviewIndex(index)}}> 
                  <div id="bksresolvedttl343">
                    <div><HiTicket/></div>
                    <div>
                      <h6>RSV{count++}: <span>{data.Problem}</span> <span id="spdate">{data.DDay}-{data.MMonth}-{data.YYear}</span></h6>
                    </div>
                  </div>
                </div>
              </div>
              {viewIndex === index ? (<>
              <div id="bksresolvedttl232">
                  <div id='bksresolvedttlbksresolvedttl343'>
                    <div>Problem {count-1}: <span>{data.Problem}</span></div>
                    <div onClick={()=>{setviewIndex(-1)}}>Close</div>
                  </div>
                  <div id='bksresolved1'>
                    <ul>
                      <li>Problem : <span>{data.Problem}</span></li>
                      <li>Category : <span>{data.Category}</span></li>
                      <li>Description : <span>{data.Description}</span></li>
                      <li>Ticket Status : <span>{data.TicketStatus}</span></li>
                      <li>Time : <span>{data.TTime}</span></li>
                      <li>Date : <span>{data.DDay}-{data.MMonth}-{data.YYear}</span></li>
                      <li>Technician : <span>{data.Technician}</span></li>
                      <li>Owner: <span>{data.TicketOwner}</span></li>
                      <li>Admin: <span>{data.Admin}</span></li>
                      <li>Rating: <span>{data.Rating}</span></li>
                    </ul>

                    <div id="ksksk343">
                      <div id="ksksk343ksksk343">
                        <div><HiStar/></div>
                        <div>Rate {data.Rating}</div>
                      </div>
                      <div id="ksksk343ksksk343">
                        <div><BiCalendar/></div>
                        <div>Date {data.DDay}-{data.MMonth}-{data.YYear}</div>
                      </div>
                    </div>
                  </div>
              </div>
              </>):null}
            </div>
            </>) : null
          ))}
        </div>
      </div>
      
        <div>
          <div id="rateflexs">
            <span>Resolved: {resolved.filter((data) => [1, 2, 3, 4, 5].includes(data.Rating) && data.Technician === email).length}</span>
          </div>
          <div id="rflxskpie">
            {Array.from({ length: 5 }, (_, ratingIndex) => {
              const rating = ratingIndex + 1;
              const ratingCount = filterRatings(rating, email);
              return (
                <div id="rateflex" key={rating}>
                  <div><span>{ratingCount}</span></div>
                  <div>{renderStars(rating)}</div>
                </div>
              );
            })}
          
          </div>
          <div id="rateflexs">
            Total Rating: {weightedRating}
          </div>
        </div>
    </div>
  </>)
}

export default KPIPersonal