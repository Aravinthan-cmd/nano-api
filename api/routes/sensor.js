import express from "express";
import { userData, userRegister,InsertData,getSensor,getallSensor,getNano,getNanoGraph} from "../controllers/sensor.js";

const router = express.Router();

//register
router.post('/register',userRegister);

//login 
router.post('/login',userData);

router.get('/InsertData',InsertData);

router.get('/getsensor', getSensor);

router.get('/getallsensor', getallSensor);

router.get('/getNano',getNano);

router.get('/getNanoGraph', getNanoGraph);

export default router;