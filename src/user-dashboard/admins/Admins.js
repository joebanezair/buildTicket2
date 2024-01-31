import React, { useEffect, useState } from 'react';
import UserAdmin from '../user-navigations/useradmins';
import ConfirmUsers from '../../user-approval/approveUsers';
import AdminQue from './components/AdminQue';
import AdminCategories from './AdminCategories';
import AdminTicketProcess from './AdminTicketProcess';

const Admins = () => {
  

  return (
    <>
      <UserAdmin />
      <div id="admin-container">
        <div id='left-admin-panel'>
          <div>
            <AdminTicketProcess />
          </div>
        </div>
        <div id='right-admin-panel'>
          <div>
            <AdminQue />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admins;
 