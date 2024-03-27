import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from 'mongoose'
import { DB_URL } from "./config.js";
import  authrouter from './router/auth.js'
import addRouter from './router/ad.js'
const app = express();


// DB connection
async function main() {
    await mongoose.connect(DB_URL); 
}
main().then(()=>{
    console.log('DB Connected');
}).catch((err)=>{
    console.log(err);
})

// middlewares
app.use(express.json({limit:'10mb'}));
app.use(morgan("dev"));
app.use(cors());
app.use('/api',authrouter )
app.use('/api',addRouter )


if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/frontend/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
  } else {
    const __dirname = path.resolve();
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }
app.listen(8000, () => console.log("server_running_on_port_8000"));