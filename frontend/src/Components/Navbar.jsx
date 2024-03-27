import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../house.jpg";
import { useAuth } from "../context/authContext.js";
export default function Navbar() {

  const [auth,setAuth]=useAuth()
  const navigate = useNavigate();

  const logout = () => {
    setAuth({ user: null, token: "", refreshToken: "" });
    localStorage.removeItem("auth");
    navigate("/login");
  }; 
const isLoggedIn=auth.user!==null && auth.token !=='' && auth.refreshToken !=='';
 const handleClick=()=>{
  if(isLoggedIn){
    navigate('/ad/create')
  }else{
    navigate('/login')
  }
 }
  return (
    <nav
      class="navbar"
      style={{
        backgroundColor: "#6f42c1",
        height: "80px",
      }}
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img
            src={Logo}
            alt="Logo"
            width="50"
            height="50"
            style={{
              borderRadius: "24px",
              marginRight: "10px",
            }}
          />
          <span style={{ color: "white" }}>Real Estate App</span>
        </NavLink>

        <div className="d-flex p-2">
          <NavLink className="nav-link" aria-current="page" to="/">
            Home
          </NavLink>
          <NavLink className="nav-link" aria-current="page" to="/agents">
        Agents
      </NavLink>
      <NavLink className="nav-link" aria-current="page" to="/search">
        Search
      </NavLink>
          <a className="nav-link pointer" aria-current="page" onClick={handleClick}>
            Post Ad
          </a>
          {!isLoggedIn ? (
        <>
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
          <NavLink className="nav-link" to="/register">
            Register
          </NavLink>
        </>
      ) : (
        ""
      )}
      
        </div>
{isLoggedIn?(
    <div
          className="dropdown"
          style={{
            marginTop: "-20px",
          }}
        >
          <li>
            <a className="nav-link dropdown-toggle pointer" data-bs-toggle="dropdown"> 
         {auth?.user?.name ? auth.user.name : auth.user.username}

            </a>
            <ul className="dropdown-menu">
              <li>
                <NavLink className="nav-link" to="/dashboard">
                  Dashboard
                </NavLink>
              </li>
              <li>
                <a className="nav-link" onClick={logout}>Logout</a>
              </li>
            </ul>
          </li>
        </div>
):(
  ""
)}
      </div>
    </nav>
  );
}
