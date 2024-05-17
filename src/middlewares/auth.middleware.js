import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

import jwt from "jsonwebtoken";

export const verifyJWT = AsyncHandler(async (req, _, next) => {
  if(!req.header('authorization')) return res.status(401).send('Access Denied');
    // if undefined then return 401
    if(req.header('authorization')===undefined) return res.status(401).send('Access Denied');
    const token=req.header('authorization').split(' ')[1];
    
    if(!token) return res.status(401).send('Access Denied');
    try{
        const verified=jwt.verify(token,process.env.ACCESS_TOKEN_USER_SECRET);
        req.id=verified.id;        
        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
});
