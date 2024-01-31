import React from 'react'
import ConfirmUsers from '../../user-approval/approveUsers'
import AdminCategories from './AdminCategories'
import { UserTechniciansProfile } from '../user-navigations/usertechnicians'

const AdminMonitoring = () => {
  return (
    <div>
      <div>
        <UserTechniciansProfile />
      </div>
      <div>
        <ConfirmUsers />
      </div>
      <div>
        <AdminCategories />
      </div>
    </div>
  )
}

export default AdminMonitoring