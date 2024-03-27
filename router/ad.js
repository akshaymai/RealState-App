// /upload-image

import express from 'express'
import * as addcontroller from '../controller/add.js'
import { requireSignin } from "../middleware/auth.js";
const router=express.Router()
 
router.post('/upload-image',requireSignin,addcontroller.uploadPhoto);
router.post('/delete-image',requireSignin,addcontroller.removeImage);
router.post('/ad-create',requireSignin,addcontroller.adPost);
router.get('/ad-get',addcontroller.fetchAdd);
router.get("/ad/:slug", addcontroller.read);
router.post('/wishlist',requireSignin,addcontroller.addToWishList) 
router.delete('/wishlist/:adId',requireSignin,addcontroller.removeToWishList)
router.post("/contact-seller", requireSignin, addcontroller.contactSeller);
router.get("/user-ads/:page", requireSignin, addcontroller.userAd);
router.put("/ad/:_id", requireSignin, addcontroller.updateAdd);
router.get("/enquiries", requireSignin, addcontroller.enquiriedProperties);
router.get("/wishlist", requireSignin, addcontroller.wishlist);
router.delete("/ad/:_id", requireSignin, addcontroller.remove);
router.get("/ads-for-sell", addcontroller.adsForSell);
router.get("/ads-for-rent", addcontroller.adsForRent);
router.get("/search", addcontroller.search);

export default router