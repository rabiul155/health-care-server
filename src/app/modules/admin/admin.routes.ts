import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import adminValidationSchema from "./admin.validation";
import { Authenticate, Authorization } from "../../middleware/auth";

const router = express.Router();

//Authenticate all route
router.use(Authenticate);

router.get(
  "/",
  Authorization("ADMIN", "SUPER_ADMIN"),
  adminController.getAllAdmin
);
router.get(
  "/:id",
  Authorization("ADMIN", "SUPER_ADMIN"),
  adminController.getAdmin
);
router.patch(
  "/:id",
  Authorization("ADMIN", "SUPER_ADMIN"),
  validateRequest(adminValidationSchema),
  adminController.updateAdmin
);
router.delete(
  "/:id",
  Authorization("SUPER_ADMIN"),
  adminController.deleteAdmin
);
router.delete(
  "/soft/:id",
  Authorization("SUPER_ADMIN"),
  adminController.softDeleteAdmin
);

export const adminRouter = router;
