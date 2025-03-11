import express from "express";
import { specialtiesController } from "./specialties.controller";
import { Authenticate } from "../../middleware/auth";
import { FileUploader } from "../../middleware/fileUploader";
import parseStringToJSON from "../../utils/parseStringToJson";

const router = express.Router();

router.post(
  "/",
  Authenticate,
  FileUploader.uploadImage,
  parseStringToJSON,
  specialtiesController.createSpecialties
);

router.get("/", Authenticate, specialtiesController.getSpecialties);

export const specialtiesRouter = router;
