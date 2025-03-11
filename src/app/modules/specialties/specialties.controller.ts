import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { specialtiesServices } from "./specialties.services";

const createSpecialties: RequestHandler = catchAsync(async (req, res) => {
  const result = await specialtiesServices.createSpecialties(req);

  res.status(201).json({
    success: true,
    message: "Specialties created successfully",
    data: result,
  });
});

export const specialtiesController = {
  createSpecialties,
};
