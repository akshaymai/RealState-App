import React from 'react'
import { useAuth } from '../context/authContext'
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'
export default function LikeUnlike({ ad }) {

    const navigate=useNavigate();
    // const location=useLocation();

    const [auth, setAuth] = useAuth() 
      const handleLike=async(id)=>{
    try {
        if(auth.user===null){
            navigate("/login", {
                state: `/ad/${ad.slug}`,
              });
            // navigate("/login");
            return;
        }

        const {data}=await axios.post('/wishlist',{addId:id})

        setAuth({...auth,user:data})

        const getLS=JSON.parse(localStorage.getItem('auth'))
        getLS.user=data;
        localStorage.setItem('auth',JSON.stringify(getLS))
        toast.success('Successfully added in Wishlist')
        // location?.state!==null?navigate(location.state) :navigate('/dashboard')
       
    } catch (error) {
      console.log('error on add',error);  
    }
      }
      const handleUnlike=async(id)=>{

        if(auth.user===null){
            navigate("/login",{
                state: `/ad/${ad.slug}`,
              });
            return;
        }
        const {data}=await axios.delete(`/wishlist/${id}`)

     setAuth({...auth,user:data})

        const getLS=JSON.parse(localStorage.getItem('auth'))
        getLS.user=data;
        localStorage.setItem('auth',JSON.stringify(getLS))
        toast.success('Successfully remove in Wishlist')
        // location?.state!==null?navigate(location.state) :navigate('/dashboard')

      }
      console.log( auth.user);
    return (
        <>
            {
                auth.user?.wishlist?.includes(ad._id) ? (
                    <FaHeart className='h2 mt-3 pointer' onClick={()=>handleUnlike(ad._id)} />
                ) : (

                    <FaRegHeart className='h2 mt-3 pointer' onClick={()=>handleLike(ad._id)}/>
                )
            }
        </>

    )
}
