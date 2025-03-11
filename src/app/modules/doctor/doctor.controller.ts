import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { DoctorService } from "./doctor.services";

const getAllFromDB: RequestHandler = catchAsync(async (req, res, next) => {
  console.log(req);
  const result = await DoctorService.getDoctorFormDB();
  res.status(200).json({
    success: true,
    message: "Doctors retrieval successfully",

    data: result,
  });
});

const getByIdFromDB: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await DoctorService.getByIdFromDB(id);
  res.status(200).json({
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

const updateIntoDB: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await DoctorService.updateIntoDB(id, req.body);

  res.status(200).json({
    success: true,
    message: "Doctor data updated!",
    data: result,
  });
});

const deleteFromDB: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await DoctorService.deleteFromDB(id);
  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDelete: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await DoctorService.softDelete(id);
  res.status(200).json({
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  updateIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
};
