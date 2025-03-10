import { RequestHandler } from "express";
import { userServices } from "./user.services";
import catchAsync from "../../utils/catchAsync";

const getUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await userServices.getUserDB(req.query);
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await userServices.createAdminDB(req);
  res.status(200).json({
    success: true,
    message: "Admin created",
    data: result,
  });
});

const createDoctor: RequestHandler = catchAsync(async (req, res) => {
  const result = await userServices.createDoctorDB(req);
  res.status(200).json({
    success: true,
    message: "Doctor created",
    data: result,
  });
});

const createPatient: RequestHandler = catchAsync(async (req, res) => {
  const result = await userServices.createPatientDB(req);

  res.status(200).json({
    success: true,
    message: "Patient created",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res, next) => {
  const result = await userServices.updateUserStatusDB(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "User status updated",
    data: result,
  });
});

const getMe = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const result = await userServices.getMeDB(req.user.id, req.user.role);

  res.status(200).json({
    success: true,
    message: "User found",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getUser,
  updateUserStatus,
  getMe,
};
