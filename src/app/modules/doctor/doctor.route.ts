import express from "express";
import { DoctorController } from "./doctor.controller";
import { UserRole } from "@prisma/client";
import { Authenticate } from "../../middleware/auth";

const router = express.Router();

router.use(Authenticate);

// task 3
router.get("/", DoctorController.getAllFromDB);

//task 4
router.get("/:id", DoctorController.getByIdFromDB);

router.patch("/:id", DoctorController.updateIntoDB);

//task 5
router.delete(
  "/:id",

  DoctorController.deleteFromDB
);

// task 6
router.delete("/soft/:id", DoctorController.softDelete);

export const DoctorRoutes = router;
