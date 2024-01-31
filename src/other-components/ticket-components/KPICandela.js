

import React, { useState } from 'react';
import Calendar from 'react-calendar';
function App() {
  const [date, setDate] = useState(new Date());
  return (
    <div id='appsss'>
     
      <div id='calendar-container'>
      <h1 className='text-center'>React Calendar</h1>
        <Calendar onChange={setDate} value={date} />
      </div>
      <p className='text-center'>
        <span >Selected Date:</span>{' '}
        {date.toDateString()}
       <div>
        day:   {date.getDay()}
       </div>
       
      </p>
    </div>
  );
}


const KPICandela = () => {
  return (
    <div>
      <App />
    </div>
  )
}

export default KPICandela



