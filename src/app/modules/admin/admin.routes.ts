import express from "express";
import { adminController } from "./admin.controller";

import { Authenticate, Authorization } from "../../middleware/auth";

const router = express.Router();

//Authenticate all route

router.use(Authenticate); //Authenticate all route

//Authenticate all route

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
