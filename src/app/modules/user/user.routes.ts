import express from "express";
import { userController } from "./user.controller";
import { FileUploader } from "../../middleware/fileUploader";
import validateRequest from "../../middleware/validateRequest";
import { userValidation } from "./user.validation";
import { Authenticate } from "../../middleware/auth";
import parseStringToJSON from "../../utils/parseStringToJson";

const router = express.Router();

router.get("/", userController.getUser);

router.get("/me", Authenticate, userController.getMe);

router.post(
  "/create-admin",
  FileUploader.uploadImage,
  parseStringToJSON,
  validateRequest(userValidation.adminValidationSchema),
  userController.createAdmin
);

router.post(
  "/create-doctor",
  FileUploader.uploadImage,
  parseStringToJSON,
  validateRequest(userValidation.doctorValidationSchema),
  userController.createDoctor
);

router.post(
  "/create-patient",
  FileUploader.uploadImage,
  parseStringToJSON,
  validateRequest(userValidation.patientValidationSchema),
  userController.createPatient
);

router.patch("/:id/status", userController.updateUserStatus);

router.patch(
  "/update-profile",
  Authenticate,
  FileUploader.uploadImage,
  parseStringToJSON,
  userController.updateMyProfile
);

export const userRoutes = router;
