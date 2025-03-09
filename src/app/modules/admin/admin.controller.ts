import { RequestHandler } from "express";
import { adminServices } from "./admin.services";
import catchAsync from "../../utils/catchAsync";

const getAllAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await adminServices.getAllAdminDB(req.query);
  res.status(200).json({
    success: true,
    message: "Admin found",
    meta: result.meta,
    data: result.data,
  });
});

const getAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await adminServices.getAdminDB(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Admin found",
    data: result,
  });
});

const updateAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await adminServices.updateAdminDB(
    req.params.id as string,
    req.body
  );
  res.status(200).json({
    success: true,
    message: "Admin updated",
    data: result,
  });
});

const deleteAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await adminServices.deleteAdminDB(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Admin deleted",
    data: result,
  });
});

const softDeleteAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await adminServices.softDeleteAdminDB(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Admin deleted",
    data: result,
  });
});

export const adminController = {
  getAllAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
