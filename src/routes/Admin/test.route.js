import express from 'express'
const testRouter = express.Router()

import { addTest,getTest } from "../../controllers/Admin/clinicaltest.controller.js";

testRouter.post('/',addTest)
testRouter.get('/',getTest)

export default testRouter