import React from "react";
import '../styles-pages/types.css';
import UserTable from "../../components/admin/UserTable";

const Users = () => {
  return (
    <div className="type-container">
      <UserTable />
 
    </div>
  );
}

export default Users; // Exporting userManage component as default