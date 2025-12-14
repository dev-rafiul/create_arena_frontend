import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <span>Loading...</span>; 
  }

  if (!user || role !== "admin") {
    return <span>Access Denied</span>; 
  }

  return children;
};

export default AdminRoute;
