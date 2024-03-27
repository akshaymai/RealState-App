import React, { useState } from "react";
import { useAuth } from "../../context/authContext.js";
import { useEffect } from "react";
import axios from "axios";
import { Outlet  } from "react-router-dom";
import  RedirectRoute from './RedirectRoute.js' 
export default function PrivateRouter() {
  const [auth, setAuth] = useAuth();
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (auth?.token) {
      getCurrentUser();
    }
  }, [auth?.token]);

  const getCurrentUser = async () => {
    try {
      const { data } =await axios.get(
        "/current-user",
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      ); 
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
    }
  };

 
  return success?<Outlet/>: <RedirectRoute />;
}
