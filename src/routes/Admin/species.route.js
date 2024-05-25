import { Router } from "express";
import { createSpecies, deleteSpecies, getSpecies, getSpeciesById, updateSpecies } from "../../controllers/Admin/species.controller.js";
const speciesRouter = Router();

speciesRouter.post('/', createSpecies)
speciesRouter.get('/', getSpecies)
speciesRouter.get('/:id', getSpeciesById)
speciesRouter.put('/:id', updateSpecies)

speciesRouter.delete('/:id', deleteSpecies)

export default speciesRouter
