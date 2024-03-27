import * as config from '../config.js'
import jwt from 'jsonwebtoken'
import { emailTemplate } from '../helper/email.js';
import { comparePassword, hashPassword } from '../helper/auth.js';
import User from '../model/auth.js'
import Ad from '../model/ad.js'
import { nanoid } from 'nanoid';
import bcrypt from "bcryptjs";
import validator from 'email-validator'
export const welcome=(req,res)=>{
    res.json({
        data:"Hello Akshay"
    })
}

export const preRegister = async (req, res) => {
    // create jwt with email and password then email as clickable link
    // only when user click on that email link, registeration completes
    try { 
      const { email, password } = req.body;
 
      if (!validator.validate(email)) {
        return res.json({ error: "A valid email is required" });
      }
      if (!password) {
        return res.json({ error: "Password is required" });
      }
      if (password && password?.length < 6) {
        return res.json({ error: "Password should be at least 6 characters" });
      }
  
      const user = await User.findOne({ email });
      if (user) {
        return res.json({ error: "Email is taken" });
      }
      const token = jwt.sign({ email, password }, config.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      config.AWSSES.sendEmail(
        emailTemplate(
          email,
          `
        <p>Please click the link below to activate your account.</p>
        <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>
        `,
          config.REPLY_TO,
          "Activate your acount"
        ),
        (err, data) => {
          if (err) { 
            console.log('ffgk',err.message );
            return res.status(500).json({  error: err.message || "Something went wrong. Try again." });
          } else {
            console.log(data);
            return res.json({ ok: true });
          }
        }
      );
    } catch (err) { 
      return res.json({ error: "Something went wrong. Try again." });
    }
  };

  export const register = async (req, res) => {
    try {
      console.log(req.body);
      const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);
 
    //   const hashedPassword = await hashPassword(password);
    const hashedPassword=await bcrypt.hash(password,8)
  
      const user = await new User({
        username: nanoid(6),
        email,
        password: hashedPassword,
      }).save();
  
      // const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      //   expiresIn: "1h",
      // });
      // const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      //   expiresIn: "7d",
      // });
  
      // user.password = undefined;
      // user.resetCode = undefined;
  
      // return res.json({
      //   token,
      //   refreshToken,
      //   user,
      // });

      tokenAndUserResponse(req,res,user)
    } catch (err) {
      console.log(err);
      return res.json({ error: "Something went wrong. Try again." });
    }
  };

  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if(!user){
        return res.json({ error: "user not found" });

      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.json({ error: "Wrong password" });
      }
      // const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      //   expiresIn: "10s",
      // });
      // const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      //   expiresIn: "7d",
      // });
      // user.password = undefined;
      // user.resetCode = undefined;
  
      // return res.json({
      //   token,
      //   refreshToken,
      //   user,
      // });

      tokenAndUserResponse(req,res,user)
    } catch (err) {
      console.log(err);
      return res.json({ error: "Something went wrong. Try again." });
    }
  };

  export const forgetPassword=async(req,res)=>{

    const {email}=req.body;
    
    if(!email){
      return res.json({error:'Please send your email'});
    }

    const foundUser=await User.findOne({email:email})
    if(!foundUser){
      return res.json({ error: "Could not find user with that email" });
    }else{
      const resetCode=nanoid()
      foundUser.resetCode=resetCode;
      foundUser.save();

      const token=jwt.sign({resetCode},config.JWT_SECRET,{expiresIn:'1h'})

      config.AWSSES.sendEmail({
        Source:config.EMAIL_FROM,
        Destination:{
          ToAddresses:[email]
        },
        Message:{
          Body:{
            Html:{
              Charset:'UTF-8',
              Data:`
              <html>
              <body>
          <p>Please click the link below to access your account.</p>
          <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access my account</a>
              </body>
              </html>
              `
            },
            Text: {
              Charset: "UTF-8", 
              Data: "This is the message body in text format."
             }
          },
          Subject:{
            Charset: "UTF-8", 
    Data: "Test email"
          }
        },
      },(err, data) => {
        if (err) {
          console.log(err);
          return res.json({ ok: false });
        } else {
          console.log(data);
          return res.json({ ok: true });
        }
      }
    )

    }




  }


export const accessAccount = async (req, res) => {
  try {
    const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);

    const user = await User.findOneAndUpdate({ resetCode }, { resetCode: "" });

    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.resetCode = undefined;

    return res.json({
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

const tokenAndUserResponse = (req, res, user) => {
  const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "1hr",
  });
  const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  user.password = undefined;
  user.resetCode = undefined;

  return res.json({
    token,
    refreshToken,
    user,
  });
};



export const refreshToken = async (req, res) => {
  try {
    const { _id } = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);

    const user = await User.findById(_id);

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Refresh token failed" });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Unauhorized" });
  }
};
export const publicProfile = async (req, res) => {
  try { 
    const user = await User.findOne({ username: req.params.username });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "User not found" });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.json({ error: "Password is required" });
    }
    if (password && password?.length < 6) {
      return res.json({ error: "Password should be min 6 characters" });
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
      password:   await bcrypt.hash(password,8)
    });

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Unauhorized" });
  }
};

export const updateProfile = async (req, res) => { 
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    user.password = undefined;
    user.resetCode = undefined;
    console.log(user);
    res.json(user);
  } catch (err) {
    console.log(err);
    if (err.codeName === "DuplicateKey") {
      return res.json({ error: "Username or email is already taken" });
    } else {
      return res.status(403).json({ error: "Unauhorized" });
    }
  }
};


export const agents = async (req, res) => {
  try {
    const agents = await User.find({ role: "Seller" }).select(
      "-password -role -enquiredProperties -wishlist -photo.key -photo.Key -photo.Bucket"
    );
    res.json(agents);
  } catch (err) {
    console.log(err);
  }
};

export const agentAdCount = async (req, res) => {
  try {
    const ads = await Ad.find({ postedBy: req.params._id }).select("_id");
    // console.log("ads count => ", ads);
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const agent = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -role -enquiredProperties -wishlist -photo.key -photo.Key -photo.Bucket"
    );
    const ads = await Ad.find({ postedBy: user._id }).select(
      "-photos.key -photos.Key -photos.ETag -photos.Bucket -location -googleMap"
    );
    res.json({ user, ads });
  } catch (err) {
    console.log(err);
  }
};
