import express from "express";
import { CreateOrder, DeleteOrderById, FindAllOrders, FindAllPrescriptions, FindOrderById, FindOrderByPrescriptionId, UpdateOrderById, deletedForPharmacy } from '../../controllers/Admin/pharmacy.controller.js';



const pharmacyRoute = express.Router();

// sending all prescriptions list 
pharmacyRoute.get("/prescriptions", FindAllPrescriptions);
pharmacyRoute.get("/prescriptions/:id", FindOrderByPrescriptionId);

pharmacyRoute.post("/", CreateOrder);
pharmacyRoute.get("/", FindAllOrders);
pharmacyRoute.get("/:id", FindOrderById);
pharmacyRoute.put("/:id", UpdateOrderById);
pharmacyRoute.delete("/:id", DeleteOrderById);
pharmacyRoute.patch("/:id", deletedForPharmacy);



export default pharmacyRoute;