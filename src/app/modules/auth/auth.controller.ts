import AppError from "../../utils/appError";
import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.services";
import { createToken, verifyToken } from "../../utils/JWTHelpers";

const loginUser: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await authServices.loginUserDB(req.body);
  const token = createToken(req.body.email, 7 * 24 * 60 * 60 * 1000);
  const refreshToken = createToken(req.body.email, 30 * 24 * 60 * 60 * 1000);

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: result,
    token: token,
  });
});

const getToken: RequestHandler = catchAsync(async (req, res, next) => {
  const user = verifyToken(req.cookies.refreshToken);
  const result = await authServices.findUser(user.email);
  if (!user.email) {
    throw new AppError(500, "User not authenticate");
  }
  const token = createToken(user.email, 7 * 24 * 60 * 60 * 1000);
  const refreshToken = createToken(user.email, 30 * 24 * 60 * 60 * 1000);
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Refresh token get successfully",
    data: result,
    token: token,
  });
});

export const authController = {
  loginUser,
  getToken,
};
