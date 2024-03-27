import axios from "axios";
import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import ViewsPhotoGallery from "./ViewsPhotoGallery";
import Logo from '../../logo.svg'
import advancedFormat from 'dayjs/plugin/relativeTime' // load on demand
import HtmlRenderer from 'react-html-renderer';

import dayjs from 'dayjs'
import { BiArea } from "react-icons/bi";
import { TbBath } from "react-icons/tb";
import { IoBedOutline } from "react-icons/io5";
import LikeUnlike from "../../Components/LikeUnlike";
import MApCard from "../../Components/MapCard";
import Card from "../../Components/Card";
import ContactSeller from "./ContactSeller";
export default function ViewsAd() {
    dayjs.extend(advancedFormat)
  const params = useParams();
  const [ad, setAd] = useState({});
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (params?.slug) fetchAd();
  }, [params?.slug]);

  const fetchAd = async () => {
    try {
      const { data } = await axios.get(`/ad/${params.slug}`);
      setAd(data?.ad);
      setRelated(data?.related);
    } catch (err) {
      console.log(err);
    }
  };
  const generatePhotosArray = (photos) => {
    if (photos?.length > 0) {
      const x = photos?.length === 1 ? 2 : 4;
      let arr = [];

      photos.map((p) =>
        arr.push({
          src: p.Location,
          width: x,
          height: x,
        })
      );
      return arr;
    } else {
      return [
        {
          src: Logo,
          width: 2,
          height: 1,
        },
      ];
    }
  };
  function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  console.log('fghfggf',ad);
  return (
    <div className="container-fluid">
      <div className="row mt-2">
        <div className="col-lg-4">
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary disabled mt-2">
              {ad.type} for {ad.action}
            </button>
            <LikeUnlike ad={ad} />
          </div>
          <div className="mt-4 mb-4">
            {ad?.sold ? "❌ Off market" : "✅ In market"}
          </div>
          <h1>{ad.address}</h1>
          <p className="card-text d-flex justify-content-between">
          {ad?.bedrooms ? (
                  <span>
               <IoBedOutline size={30}/> {ad?.bedrooms}
                  </span>
                ) : (
                  ""
                )}

                {ad?.bathrooms ? (
                  <span>
                   <TbBath size={30}/> {ad?.bathrooms}
                  </span>
                ) : (
                  ""
                )}

                {ad?.landsize ? (
                  <span>
                 <BiArea size={30}/> {ad?.landsize}
                  </span>
                ) : (
                  ""
                )}
                </p>
          {/* <AdFeatures ad={ad} /> */}
          <h3 className="mt-3 h2">₹ {ad?.price && formatNumber(ad?.price)}</h3>
          <p className="text-muted">{dayjs(ad?.createdAt).fromNow()}</p>
        </div>
        <div className="col-lg-8">
          <ViewsPhotoGallery photos={generatePhotosArray(ad?.photos)} />
        </div>
      </div>
      <div className="container mt-3 mb-5">
        <div className="row"> 
        <div className="col-lg-8 mt-3 offset-lg-2">
        
     <MApCard ad={ad}/>
        <br/>
        <h1>{ad?.type} in {ad?.address} for {ad?.action} ₹{ad?.price}</h1>
        <p className="card-text d-flex justify-content-between">
      {ad?.bedrooms ? (
        <span>
          <IoBedOutline /> {ad?.bedrooms}
        </span>
      ) : (
        ""
      )}

      {ad?.bathrooms ? (
        <span>
          <TbBath /> {ad?.bathrooms}
        </span>
      ) : (
        ""
      )}

      {ad?.landsize ? (
        <span>
          <BiArea /> {ad?.landsize}
        </span>
      ) : (
        ""
      )}
    </p>

        <hr/>
        <h3 className="fw-bold">{ad?.title}</h3>
        <p className="lead">{ad?.description}</p>
        <HtmlRenderer
        html={ad?.description?.replaceAll(".","<br/><br/>")}
        />
        </div>
      
        </div>
      </div>
      <div className="container">
        <ContactSeller ad={ad} />
      </div>
      <div className="container-fluid">
      <h4>Related Properties</h4>
      <hr style={{width:'33%'}}/>
      <div  className="row">
        {related?.map((item)=>{
          return<Card key={item._id} Ad={item}/>
        })}
      </div>
      </div>
    </div>
  );
}
