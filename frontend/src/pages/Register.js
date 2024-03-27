import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try { 
      setLoading(true);

      const { data } = await axios.post(`/pre-register`, {
        email,
        password,
      }); 
      if (data?.error) {
        toast.error(data.error); 
        setLoading(false);

      } else {
        toast.success("Please check your email to complete registration");
        setLoading(false);
         navigate('/')
      } 
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Try again.");
      setLoading(false);

    }
  }
  return (
    <div>
      <h1 className="mt-5 bg-primary text-light text-center">Register</h1>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 offset-lg-4">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                class="form-control mb-4"
                required
                autoFocus
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}

              />
              <input
                type="password"
                class="form-control mb-4"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <button  disabled={loading} className="btn btn-primary col-12 mb-4 mt-3">
          {loading?'Waiting':'Register'}     
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
