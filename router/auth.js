import express from 'express'
import * as authcontroller from '../controller/auth.js'
import { requireSignin } from "../middleware/auth.js";
const router=express.Router()


router.get('/',requireSignin,authcontroller.welcome)
router.post("/pre-register", authcontroller.preRegister);
router.post("/register", authcontroller.register);
router.post("/login", authcontroller.login);
router.post('/forget-password',authcontroller.forgetPassword)
router.post('/account-access',authcontroller.accessAccount)
router.get('/refresh-token',authcontroller.refreshToken)
router.get("/current-user", requireSignin, authcontroller.currentUser);
router.get("/profile/:username", authcontroller.publicProfile);
router.put("/update-password", requireSignin, authcontroller.updatePassword);
router.put("/update-profile", requireSignin, authcontroller.updateProfile);
router.get("/agents", authcontroller.agents);
router.get("/agent-ad-count/:_id", authcontroller.agentAdCount);
router.get("/agent/:username", authcontroller.agent);

export default router