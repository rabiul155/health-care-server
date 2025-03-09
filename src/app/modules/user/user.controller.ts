import { RequestHandler } from "express";
import { userServices } from "./user.services";

const getUser: RequestHandler = async (req, res) => {
  const result = await userServices.getUserDB(req.query);
  res.status(200).json({
    success: true,
    message: "Admin created",
    meta: result.meta,
    data: result.data,
  });
};

const createAdmin: RequestHandler = async (req, res) => {
  try {
    const result = await userServices.createAdminDB(req);
    res.status(200).json({
      success: true,
      message: "Admin created",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
      error: err,
    });
  }
};

const createDoctor: RequestHandler = async (req, res) => {
  try {
    const result = await userServices.createDoctorDB(req);
    res.status(200).json({
      success: true,
      message: "Doctor created",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
      error: err,
    });
  }
};

const createPatient: RequestHandler = async (req, res) => {
  try {
    const result = await userServices.createPatientDB(req);

    res.status(200).json({
      success: true,
      message: "Patient created",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
      error: err,
    });
  }
};

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getUser,
};
