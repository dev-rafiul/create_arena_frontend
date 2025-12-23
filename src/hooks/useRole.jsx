import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "axios";

const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`https://create-arena-backend.vercel.app/users/${user.email}/role`)
        .then((res) => setRole(res.data.role))
        .catch(() => setRole("user"))
        .finally(() => setRoleLoading(false));
    }
  }, [user]);

  return { role, roleLoading };
};

export default useRole;
