import React from "react";
import GoogleMapReact from 'google-map-react';
import { GOOGLE_API_KEY } from "../config";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function MApCard({ad}){
  const defaultProps = {
    // center: {
    //   lat: 10.99835602,
    //   lng: 77.01502627
    // },
    center: {
        lat: ad?.location?.coordinates[1],
        lng: ad?.location?.coordinates[0] 
      },
    zoom: 11
  };
if(ad?.location?.coordinates){
    return ( 
    <div style={{ height: '350px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key:GOOGLE_API_KEY}}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        
        <div
        lat= {ad?.location.coordinates[1]}
        lng={ ad?.location.coordinates[0]} 
        >
<span className="lead">📍</span>
        </div>
      </GoogleMapReact>
    </div>
  );  
}

}