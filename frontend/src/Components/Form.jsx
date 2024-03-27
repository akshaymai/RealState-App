import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-autocomplete";
import { GOOGLE_API_KEY } from "../config.js";
import CurrencyInput from "react-currency-input-field";
import ImageUpload from "./ImageUpload.jsx";
import axios from "axios";
import {    useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export default function AddForm({ action, type }) {
  const [ad, setAdd] = useState({
    photos: [],
    uploading: false,
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    carpark: "",
    landsize: "",
    title: "",
    description: "",
    loading: false,
    action,
    type
  });
  const navigate=useNavigate()
  const handleSubmit=async ()=>{
    try {
      setAdd({ ...ad, uploading: true });

      const {data}=await axios.post('/ad-create',ad)
      if (data?.error) {
        toast.error(data.error);
        setAdd({ ...ad, loading: false });
      } else {
        toast.success("Ad created successfully");
        setAdd({ ...ad, loading: false });
        navigate("/dashboard");
      }


    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="mb-3 form-control">
        <GooglePlacesAutocomplete
          style={{
            width: "90%",
            border: "1px solid lightgrey",
            padding: "5px",
            height: "40px",
            borderRadius: "5px",
          }}
          apiKey={GOOGLE_API_KEY}
          onPlaceSelected={(place) => {
            setAdd({ ...ad, address: place.formatted_address });
          }}
        />
      </div>
      <ImageUpload ad={ad} setAdd={setAdd}/>
      <div>
        <CurrencyInput
          placeholder="Enter price"
          defaultValue={ad.price}
          className="form-control mb-3"
          onValueChange={(value) => setAdd({ ...ad, price: value })}
        />
      </div>
      {type==='House' ?(
<>
   <input
        type="number"
        min="0"
        className="form-control mb-3"
        placeholder="Enter how many bedrooms"
        value={ad.bedrooms}
        onChange={(e) => setAdd({ ...ad, bedrooms: e.target.value })}
      />

      <input
        type="number"
        min="0"
        className="form-control mb-3"
        placeholder="Enter how many bathrooms"
        value={ad.bathrooms}
        onChange={(e) => setAdd({ ...ad, bathrooms: e.target.value })}
      />

      <input
        type="number"
        min="0"
        className="form-control mb-3"
        placeholder="Enter how many carpark"
        value={ad.carpark}
        onChange={(e) => setAdd({ ...ad, carpark: e.target.value })}
      />

</>
      ):(
   ""
      )}
   

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter landsize"
        value={ad.landsize}
        onChange={(e) => setAdd({ ...ad, landsize: e.target.value })}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter Title"
        onChange={(e) => setAdd({ ...ad, title: e.target.value })}
        value={ad.title}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter Description"
        onChange={(e) => setAdd({ ...ad, description: e.target.value })}
        value={ad.description}
      />
      <button onClick={handleSubmit} className={`btn-primary btn mb-5 ${ad.loading}? disabled :""`}>Submit</button>
      <pre>{JSON.stringify(ad,null,4)}</pre>
    </>
  );
}
