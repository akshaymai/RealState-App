import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";
export default function Accoutactive() {
  const [auth, setAuth] = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();

  const requestActivation = async () => {
    try {
      const { data } = await axios.post(`/register`, { token });
      if (data?.error) {
        toast.error(data.error);
      } else {
        // save in local storage
        localStorage.setItem("auth", JSON.stringify(data));
        // save in context
        setAuth(data);
        toast.success("Successfully logged in. Welcome to Realist app.");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    if (token) {
      requestActivation();
    }
  }, [token]);

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        Please Wait while Registeing....
      </h1>
    </div>
  );
}
