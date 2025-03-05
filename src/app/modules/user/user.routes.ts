import express from "express";
import { userController } from "./user.controller";
import { uploadFile } from "../../middleware/fileUploader";

const router = express.Router();

router.get("/", userController.getUser);
router.post(
  "/",
  uploadFile.uploadImage,
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.createAdmin
);

export const userRoutes = router;
