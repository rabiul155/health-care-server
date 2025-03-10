import express from "express";
import { userController } from "./user.controller";
import { uploadFile } from "../../middleware/fileUploader";
import validateRequest from "../../middleware/validateRequest";
import { userValidation } from "./user.validation";
import { Authenticate } from "../../middleware/auth";

const router = express.Router();

router.get("/", userController.getUser);

router.get("/me", Authenticate, userController.getMe);

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

router.patch("/:id/status", userController.updateUserStatus);

router.patch(
  "/update-profile",
  Authenticate,
  uploadFile.uploadImage,
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.updateMyProfile
);

export const userRoutes = router;
