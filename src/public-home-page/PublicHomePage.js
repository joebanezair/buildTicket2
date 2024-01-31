import React from 'react'
import NavigationDashboard from '../other-components/dashboard-navigation/NavigationDashboard'
import Moderator from '../context/Moderator'
import PublicD from '../public-dashboard/publicD';

const PublicHomePage = () => {
  const {email} = Moderator();
  return (
    <>
     <NavigationDashboard />
     <div>
       <div>
        {!email? (
           <PublicD />
        ) : (
          <div>
            How can we help you?
          </div>
        )}
       </div>
     </div>

    </>
  )
}

export default PublicHomePage