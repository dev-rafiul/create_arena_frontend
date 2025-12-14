import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loading from "../Pages/Shared/Loading";
import Forbidden from "../Pages/Shared/Forbidden";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loading></Loading>; 
  }

  if (!user || role !== "admin") {
    return <Forbidden></Forbidden>; 
  }

  return children;
};

export default AdminRoute;
