import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.services";

const loginUser: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await authServices.loginUserDB(req.body);
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

const getAllUser: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await authServices.getAllUserDB();
  res.status(200).json({
    success: true,
    message: "Find all user successfully",
    data: result,
  });
});

export const authController = {
  loginUser,
  getAllUser,
};
