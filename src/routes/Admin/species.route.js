import { Router } from "express";
import {
  createSpecies,
  deleteSpecies,
  getSpecies,
  getSpeciesById,
  searchSpecies,
  updateSpecies,
} from "../../controllers/Admin/species.controller.js";
const speciesRouter = Router();

// search
speciesRouter.get("/search", searchSpecies);

speciesRouter.post("/", createSpecies);
speciesRouter.get("/", getSpecies);
speciesRouter.get("/:id", getSpeciesById);
speciesRouter.put("/:id", updateSpecies);

speciesRouter.delete("/:id", deleteSpecies);

export default speciesRouter;
