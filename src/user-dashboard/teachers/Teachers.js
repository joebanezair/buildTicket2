import React, { useState } from 'react'
import UserTeachers from '../user-navigations/userteachers';
import NormalTicket from './components/NormalTicket';
import Inque from '../../other-components/ticket-components/Inque';
import RejectQueue from './components/RejectQueue';

const Teachers = () => {

  const [openTicketGenre, setTicketGenre] = useState('inque');
 
  //users-panel
  return (<>
    <UserTeachers />
    <div id='teachers-container'> 

      <div id='teachers-dashboard'>
        <div id='teacher-ticket-container'>
         <div id='cta-components-teacher'>
           {/* CTA - Components */}
           <div id='cta-container-teach'>
             <div id='t-cta-buttons'>
               <button id='btn' onClick={()=>{setTicketGenre('inque')}}>My Que</button>
               <button id='btn' onClick={()=>{setTicketGenre('records')}}>Records</button>
               <button id='btn' onClick={()=>{setTicketGenre('rejected')}}>Rejected</button>
             </div>
             <div id='t-cta-contents'>
               <div>
               {openTicketGenre === 'inque' ? (
                  <Inque />
                ) : openTicketGenre === 'records' ? (
                  <>
                    records
                  </>
                ) : openTicketGenre === 'rejected' ? (
                  <>
                    <div id='rejectedwasser'>
                      <RejectQueue />
                    </div>
                  </>
                ) : null}

               </div>
             </div>
           </div>
         </div>
         
        </div>
      </div>
     
      <div id='teachers-analytics'>
        <div id='teacher-shta'>
          <div>
            <Inque />
          </div>
        </div>
      </div>
    </div>
  </>)
}
export default Teachers


