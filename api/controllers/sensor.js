import Data from '../model/sensorModel.js'
import User from "../model/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import axios from 'axios'

//Register
export const userRegister = async (req, res) => {
    console.log(req.body)
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            email: req.body.email,
            password: newPassword,
        })
        res.json({status: 'ok'})
    } catch (error) {
        res.json({status: 'error', error: 'Duplicate email'})
    }
}

//login
export const userData = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })
    if(!user) {
        return {status: 'error', error: 'Invalid User'}
    }
    const isPasswordVaild = await bcrypt.compare(
        req.body.password,
        user.password
    )
    if (isPasswordVaild) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email
            },
            'secret123'
        )
        return res.json({status: 'ok', user: token})
    } else {
        return res.json({status: 'error', user: false})
    }
}

//Insert 
export const InsertData = async (req, res) => {
    const { vibration, acoustics, temperature, humidity, rpm, magnetic_flex, timestamp } = req.query;
    

    if (!vibration || !acoustics || !temperature || !humidity || !rpm || !magnetic_flex || !timestamp) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        const newData = {
            vibration: vibration,
            acoustics: acoustics,
            temperature: temperature,
            humidity: humidity,
            rpm: rpm,
            magnetic_flex: magnetic_flex,
            timestamp: timestamp,
        };

        await Data.create(newData); // Use Data instead of sensor
        res.status(200).json({ message: "Data inserted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//get
export const getSensor = async(req,res)=>{
    try {
        const getsensor= await Data.find().sort({updatedAt:-1}).limit(1);
        res.status(200).json(getsensor);
    } catch (error) {
        res.status(500).json(error);
    }
};

//get
export const getallSensor = async(req,res)=>{
    try {
        const getsensor= await Data.find().sort({updatedAt:-1}).limit(50);
        res.status(200).json(getsensor);
    } catch (error) {
        res.status(500).json(error);
    }
};

const credentials = {
  username: "aswin",
  password: "xtw83te>fabtnec",
  org_name: "XYMA"
};

const getAuthToken = async (credentials) => {
  try {
    const response = await axios.post('https://nanoprecisedataservices.com/data-sharing/api/v2/auth', credentials);
    return response.data.token;
  } catch (error) {
    throw new Error("Error fetching authentication token");
  }
}

export const getNano = async (req, res) => {
    try {
    //   const currentEpochTime = Math.floor(new Date().getTime() / 1000);
      const token = await getAuthToken(credentials);
      console.log(token)
      const response = await axios.get('https://nanoprecisedataservices.com/data-sharing/api/v2/graphId', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

//   const currentEpochTime = Math.floor(new Date().getTime() / 1000);
//   const oneDaySeconds = 24 * 60 * 60; // Number of seconds in a day
//   const oneDayBeforeEpochTime = currentEpochTime - oneDaySeconds; // One day before current epoch time
  
export  const getNanoGraph = async (req, res) => {
    const token = await getAuthToken(credentials);
    const {graphName,startDate,endDate} =req.query;
    console.log(graphName);
    try {
      const response = await axios.get('https://nanoprecisedataservices.com/data-sharing/api/v2/analytics/graph', {
        params: {
          graphId: 'sound-rms',
          tagIdList: 'XYMA7fc929ceb79c4a36ab7ef3939c8595f1',
          timestampFrom: 1706440070,
          timestampTo: 1707391067,
          companyCode: 'XYMA'
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json(error);
    }
  }  



