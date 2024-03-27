import React from 'react'
import { IoBedOutline } from "react-icons/io5";
import { TbBath } from "react-icons/tb";
import { BiArea } from "react-icons/bi"; 
import {Badge} from 'antd'
import { Link } from 'react-router-dom';
export default function Card({Ad}) {
    function formatNumber(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
  return (
    <div className='col-lg-4 p-4 gx-4 gy-4'>
           <Link to={`/ad/${Ad.slug}`}>
        <Badge.Ribbon
          text={`${Ad?.type} for ${Ad?.action}`}
          color={`${Ad?.action === "Sell" ? "red" : "blue"}`}
        >
        <div className="card hoverable shadow">
        <img
        alt={Ad?.slug}
        src={Ad?.photos?.[0].Location}
         style={{height:'240px',objectFit:'cover'}}
        />
        </div>
   
        <div className="card-body">
              <h3>₹ {formatNumber(Ad?.price)}</h3>
              <p className="card-text">{Ad?.address}</p>

              <p className="card-text d-flex justify-content-between">
                {Ad?.bedrooms ? (
                  <span>
               <IoBedOutline size={30}/> {Ad?.bedrooms}
                  </span>
                ) : (
                  ""
                )}

                {Ad?.bathrooms ? (
                  <span>
                   <TbBath size={30}/> {Ad?.bathrooms}
                  </span>
                ) : (
                  ""
                )}

                {Ad?.landsize ? (
                  <span>
                 <BiArea size={30}/> {Ad?.landsize}
                  </span>
                ) : (
                  ""
                )}
              </p>
              </div>
              </Badge.Ribbon>
              </Link>
    </div>
  )
}
