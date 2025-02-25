import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import adminValidationSchema from "./admin.validation";

const router = express.Router();

router.get("/", adminController.getAllAdmin);
router.get("/:id", adminController.getAdmin);
router.patch(
  "/:id",
  validateRequest(adminValidationSchema),
  adminController.updateAdmin
);
router.delete("/:id", adminController.deleteAdmin);
router.delete("/soft/:id", adminController.softDeleteAdmin);

export const adminRouter = router;
