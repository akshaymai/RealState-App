import { nanoid } from "nanoid";
import * as config from '../config.js'
import Ad from '../model/ad.js'
import User from '../model/auth.js'
import { emailTemplate } from '../helper/email.js';

import slugify from "slugify";
export const uploadPhoto=async(req,res)=>{
    try {
        const {image}=req.body;


    const base64Image = new Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const type = image.split(";")[0].split("/")[1];
   
    const params = {
      Bucket: "real-state-images",
      Key: `${nanoid()}.${type}`,
      Body: base64Image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    }; 
    config.AWSS3.upload(params, (err, data) => {
      if (err) { 
        console.log(err);
        res.sendStatus(400);
      } else { 
        res.send(data);
      }
    });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Image upload  failed" });

    }
}

export const removeImage = (req, res) => {
    try {
      const { Key, Bucket } = req.body;
  
      config.AWSS3.deleteObject({ Bucket, Key }, (err, data) => {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        } else {
          res.send({ ok: true });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

 export const adPost=async (req,res)=>{
  try {
    const { photos, description, title, address, price, type, landsize } =
    req.body;
  if (!photos?.length) {
    return res.json({ error: "Photos are required" });
  }
  if (!price) {
    return res.json({ error: "Price is required" });
  }
  if (!type) {
    return res.json({ error: "Is property house or land?" });
  }
  if (!address) {
    return res.json({ error: "Address is required" });
  }
  if (!description) {
    return res.json({ error: "Description is required" });
  }

  const geo=await config.geocoder.geocode(address)
  const ad = await new Ad({
    ...req.body,
    postedBy: req.user._id,
    location: {
      type: "Point",
      coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
    },
    googleMap: geo,
    slug: slugify(`${type}-${address}-${price}-${nanoid(6)}`),
  }).save();
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { role: "Seller" },
    },
    { new: true }
  );

  user.password = undefined;
  user.resetCode = undefined;

  res.json({
    ad,
    user,
  });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "failed to add ad" });

  }
 } 

 export const fetchAdd=async(req,res)=>{
  try {
    
    const fetchSell=await Ad.find({action:'Sell'})
    .select("-googleMap -location -photos.Etag -photos.key")
    .sort({createdAt:-1})
    .limit(12)

    const fetchRent=await Ad.find({action:'Rent'})
    .select("-googleMap -location -photos.Etag -photos.key")
    .sort({createdAt:-1})
    .limit(12)
 
    res.status(200).json({fetchRent,fetchSell})
  } catch (error) {
    console.log(error);
    return res.status(403).json({message:"Failed to fetch Add "})
  }
 }
 export const read = async (req, res) => {
  try {
    const ad = await Ad.findOne({ slug: req.params.slug }).populate(
      "postedBy",
      "name username email phone company photo.Location"
    );

    // related
    const related = await Ad.find({
      _id: { $ne: ad._id },
      action: ad.action,
      type: ad.type,
      address: {
        $regex: ad.googleMap[0].city,
        // $regex: ad.googleMap[0]?.administrativeLevels.level2long ||'',

        $options: "i",
      },
    })
      .limit(3)
      .select("-photos.Key -photos.key -photos.ETag -photos.Bucket -googleMap");

    res.json({ ad, related });
  } catch (err) {
    console.log(err);
  }
};
export const addToWishList=async (req,res)=>{

  try {

    const user=await User.findByIdAndUpdate({_id:req.user._id},{
      $addToSet:{wishlist:req.body.addId}
    },{
      new:true
    })

    const {password,resetCode,...rest}=user._doc;
    res.json(user)
    
  } catch (error) {
    return res.status(400).json({message:"Unable to add wishlist"})
  }
}
export const removeToWishList=async (req,res)=>{
  try {

    const user=await User.findByIdAndUpdate({_id:req.user._id},{
      $pull:{wishlist:req.params.adId}
    },{
      new:true
    })

    const {password,resetCode,...rest}=user._doc;
    res.json(user)
    
  } catch (error) {
    return res.status(400).json({message:"Unable to remove wishlist"})
  }
}

export const contactSeller = async (req, res) => {
  try {
    const { name, email, message, phone, adId } = req.body;
    const ad = await Ad.findById(adId).populate("postedBy", "email");

    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enquiredProperties: adId },
    });

    if (!user) {
      return res.json({ error: "Could not find user with that email" });
    } else {
      // send email
      config.AWSSES.sendEmail(
        emailTemplate(
          ad.postedBy.email,
          `
        <p>You have received a new customer enquiry</p>

          <h4>Customer details</h4>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Phone: ${phone}</p>
          <p>Message: ${message}</p>

        <a href="${config.CLIENT_URL}/ad/${ad.slug}">${ad.type} in ${ad.address} for ${ad.action} ${ad.price}</a>
        `,
          email,
          "New enquiry received"
        ),
        (err, data) => {
          if (err) {
            console.log(err);
            return res.json({ ok: false });
          } else {
            console.log(data);
            return res.json({ ok: true });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};


export const userAd=async (req,res)=>{
  try {
    const perpage=5;
    const page=req.params.page?req.params.page:1;
    const total=await Ad.find({postedBy:req.user._id});

    const  ads=await Ad
    .find({postedBy:req.user._id})
    .populate('postedBy',"name email username phone company")
    .skip((page-1)*perpage)
    .limit(perpage)
    .sort({createdAt:-1})


    res.json({ads,total:total.length})
  } catch (error) {
    
  }
}


export const updateAdd = async (req, res) => {
  try {
    const { photos, price, type, address, description } = req.body;

    const ad = await Ad.findById(req.params._id);

    const owner = req.user._id == ad?.postedBy;

    if (!owner) {
      return res.json({ error: "Permission denied" });
    } else {
      // validation
      if (!photos.length) {
        return res.json({ error: "Photos are required" });
      }
      if (!price) {
        return res.json({ error: "Price is required" });
      }
      if (!type) {
        return res.json({ error: "Is property hour or land?" });
      }
      if (!address) {
        return res.json({ error: "Address is required" });
      }
      if (!description) {
        return res.json({ error: "Description are required" });
      }

      const geo = await config.geocoder.geocode(address);

      await ad.updateOne({
        ...req.body,
        slug: ad.slug,
        location: {
          type: "Point",
          coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
        },
      });

      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};

export const enquiriedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.enquiredProperties }).sort({
      createdAt: -1,
    });
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};
export const wishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.wishlist }).sort({
      createdAt: -1,
    });
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};
export const remove = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params._id);
    const owner = req.user._id == ad?.postedBy;

    if (!owner) {
      return res.json({ error: "Permission denied" });
    } else {
      await Ad.findByIdAndDelete(ad._id);
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};

export const adsForSell = async (req, res) => {
  try {
    const ads = await Ad.find({ action: "Sell" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(24);

    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const adsForRent = async (req, res) => {
  try {
    const ads = await Ad.find({ action: "Rent" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(24);

    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const search = async (req, res) => {
  try { 
    const { action, address, type, priceRange } = req.query;
 console.log(priceRange);
    const geo = await config.geocoder.geocode(address);
 
    const ads = await Ad.find({
      action: action === "Buy" ? "Sell" : "Rent",
      type,
      price: {
        $gte: parseInt(priceRange[0]),
        $lte: parseInt(priceRange[1]),
      },
      location: 
      { $near: 
        {
          $maxDistance: 50000, // 1000m = 1km
          $geometry: {
            type: "Point",
            coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
          },
          $minDistance:10000
        },
      },
    })
      .limit(24)
      .sort({ createdAt: -1 })
      .select(
        "-photos.key -photos.Key -photos.ETag -photos.Bucket -location -googleMap"
      );
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};