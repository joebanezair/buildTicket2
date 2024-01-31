import React, { useState } from 'react'
import UserTechnicians from '../user-navigations/usertechnicians'
import RejectQueue from './techcomponents/RejectQueue'
import GeneralTickets from '../../other-components/ticket-components/GeneralTickets'
import InqueNewDesign from '../../other-components/ticket-components/InqueNewDesign'
import AquiredMine, { InProgressMine, ResolvedMine, SendFeedbackMine } from '../../other-components/ticket-components/AquiredMine'
import KPITableView from '../../other-components/ticket-components/KPITableView'

const Technicians = () => {
  const [queue44, setqueue44] = useState('My Queue');

   return (<>
     <UserTechnicians />
     <div id='techpadd232'>
       <div>
        <div id='techpadd23212'>
          <>
            <div id='btnTechNaxc'>
              <button onClick={()=>{setqueue44('My Queue')}}>My Tickets</button>
              <button onClick={()=>{setqueue44('Rejected')}}>Rejected</button>
              <button onClick={()=>{setqueue44('Candela')}}>KPI</button>
              <button onClick={()=>{setqueue44('General')}}>All Tickets</button>
            </div>
                <div id='pgsflx'>
                      <div >
                        {queue44 === 'My Queue' ? (
                          <>
                           <div>
                              <div id='quepadd9393stech'>
                                <div>
                                <InqueNewDesign />
                                </div>
                                <div id='quepadd9393stech1'>
                                <AquiredMine />
                                </div>
                                <div id='quepadd9393stech1'>
                                <SendFeedbackMine />
                                </div>
                                <div id='quepadd9393stech1'>
                                <InProgressMine />
                                </div>
                                <div id='quepadd9393stech1'>
                                <ResolvedMine />
                                </div>
                              </div> 
                           </div>
                          </>
                          ): queue44 === 'Rejected' ? (
                            <>
                              <div id='padtechreje333'>
                                <RejectQueue />
                              </div> 
                            </>
                          ) : queue44 === 'Candela' ? (
                            <>
                              <div id='KPITable1'>
                                 <div></div>
                                 <div>
                                  <KPITableView />
                                 </div>
                              </div>
                            </>
                          ) : queue44 === 'General' && (
                            <>
                              <div id='genTicks'>
                                <GeneralTickets />
                              </div> 
                            </>
                          )}
                      </div>
                      <div>
                        <div id='KPITable'>
                            <KPITableView />
                        </div>
                      </div>
                    </div>
                </>
        </div>
       </div>
     </div>
   </>)
 }

 export default Technicians