import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import axios from 'axios'
import Card from '../Components/Card'
import SearchForm from '../Components/SearchForm'

export default function Home() {
  const [auth,setAuth]=useAuth()
  const [adForSell,setAdForSell]=useState([])
  const [adForRent,setAdForRent]=useState([])

  useEffect(()=>{

    (async ()=>{

      const {data}=await axios.get('/ad-get');
      setAdForRent(data.fetchRent)
      setAdForSell(data.fetchSell)
    })()
  },[])


  return (
    <div>
      {/* <SearchForm/> */}
      <h1 className=' mt-5 bg-primary text-light text-center'>For Rent</h1>
      {/* <pre>{JSON.stringify({adForRent,adForSell}, null, 4)}</pre> */}
      <div className='container'>
       <div className='row'>
       {adForRent.map((item,i)=>{
          return(
            <Card key={i} Ad={item}/>
          )
        })}
       </div>
        
      </div>
      <h1 className=' mt-5 bg-primary text-light text-center'>For Sell</h1>
      <div className='container'>
       <div className='row'>
        {adForSell.map((item,i)=>{
          return(
            <Card key={i} Ad={item}/>
          )
        })}
        </div>
      </div>
    </div>
  )
}
