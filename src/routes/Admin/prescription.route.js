import { Router } from "express";
const prescriptionRouter = Router();

import {
  Create,
  Find,
  FindBy,
  Updateby,
  Deleteby,
  Search,
} from "../../controllers/Admin/prescription.controller.js";

prescriptionRouter.post('/',Create)
prescriptionRouter.get('/',Find)
prescriptionRouter.get('/:id',FindBy)
prescriptionRouter.put('/:id',Updateby)
prescriptionRouter.delete('/:id',Deleteby)
prescriptionRouter.get('/search',Search)



export default prescriptionRouter