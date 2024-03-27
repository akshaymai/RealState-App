import React from "react";
import Resizer from "react-image-file-resizer";
import axios from 'axios'
import Avator, { Avatar } from 'antd'
export default function ImageUpload({ ad, setAdd }) {
  const handleUpload = (e) => {
try {
    let files = e.target.files;
    files = [...files];
    if (files.length > 0) {
      setAdd({ ...ad, uploading: true });

      files.map((file) => {
        console.log(file);
        return new  Promise(() => {
          Resizer.imageFileResizer(file,1080,720,"JPEG",100,0,async(uri) => {
             try {
                const {data} =await axios.post('/upload-image',{
                    image:uri
                })
                setAdd((prev)=>({
                    ...prev,
                    uploading:false,
                    photos:[data,...prev.photos]
                }))
             } catch (error) {
                console.log('errr on upload image api',error);
                setAdd({...ad,uploading:false})
             }
            },
            "base64"
          );
        });
      });
    }
} catch (error) {
    console.log(error);
}
  }; 

 const deleteUpload=async(file)=>{
  const answer = window.confirm("Delete image?");
  if (!answer) return;
  setAdd({ ...ad, uploading: true });
  try {
    
    const {data}=await axios.post('/delete-image',file)
    if(data?.ok){
      setAdd((prev)=>({
        ...prev,
        uploading:false,
        photos:[prev.photos.filter((item)=>item.key !==file.Key)]
      }))
    }
  } catch (error) {
    console.log(error);
    setAdd({ ...ad, uploading: false });
  }

 } 
  return (
    <>
    
        <label className="btn btn-secondary mb-2">
    {ad.uploading ?'Uploading Images':" Upload photos"} 
      <input
        onChange={handleUpload}
        type="file"
        accept="image/*"
        multiple
        hidden
      />

    </label>
    {ad.photos.length>0 && ad.photos?.map((item)=>{
      return(
         <Avatar
         
        onClick={()=>deleteUpload(item)}
        src={item?.Location}
        shape="square"
        size={50}
        className="ml-2 mb-1"
        />
      ) 
      })}
    </>


  );
}
