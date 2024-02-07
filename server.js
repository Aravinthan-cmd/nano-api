import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import sensorRoute from "./api/routes/sensor.js";
// import bcrypt from 'bcryptjs';
const app = express();

const connect = async () =>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/nanoprecise');
        console.log('Mongodb Connected..');
    } catch (error) {
        throw error;
    }
};
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB!');
});
mongoose.connection.on('disconnected',()=>{
    console.log('Mongodb disconnected...');
});

//middlewares
//for json
app.use(express.json());

// Enable CORS with dynamic origin check
// app.use(cors({
//   origin: (origin, callback) => {
//     // Check if the origin is allowed or if it's undefined (for same-origin requests)
//     const allowedOrigins = ['http://192.168.1.200:3000'];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// }));

app.use(cors({
    origin: '*',
}))

app.use('/sensor',sensorRoute);

app.listen(4000, ()=>{
    connect();
    console.log('Server Started..');
});