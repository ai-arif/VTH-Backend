import { Router } from "express";
import {
  createBreed,
  deleteBreed,
  getBreedById,
  getBreeds,
  getBreedsBySpecies,
  updateBreed,
} from "../../controllers/Admin/breed.controller.js";

const breedRouter = Router();

breedRouter.post("/", createBreed);
breedRouter.get("/", getBreeds);
breedRouter.get("/:id", getBreedById);
breedRouter.put("/:id", updateBreed);

breedRouter.delete("/:id", deleteBreed);
breedRouter.get("/species/:speciesId", getBreedsBySpecies);

export default breedRouter;
