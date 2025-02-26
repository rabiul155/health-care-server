import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.services";
import createToken from "../../utils/createToken";

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

export const authController = {
  loginUser,
};
