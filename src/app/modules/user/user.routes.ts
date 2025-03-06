import express from "express";
import { userController } from "./user.controller";
import { uploadFile } from "../../middleware/fileUploader";
import validateRequest from "../../middleware/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();

router.get("/", userController.getUser);
router.post(
  "/create-admin",
  uploadFile.uploadImage,
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidation.adminValidationSchema),
  userController.createAdmin
);

router.post(
  "/create-doctor",
  uploadFile.uploadImage,
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidation.doctorValidationSchema),
  userController.createDoctor
);

router.post(
  "/create-patient",
  uploadFile.uploadImage,
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidation.patientValidationSchema),
  userController.createPatient
);

export const userRoutes = router;
