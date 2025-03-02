import { NextFunction, Request, RequestHandler, Response } from "express";

import catchAsync from "../utils/catchAsync";
import { verifyToken } from "../utils/JWTHelpers";
import AppError from "../utils/appError";
import Prisma from "../Prisma";
import { UserRole } from "@prisma/client";

export const Authenticate: RequestHandler = catchAsync(
  async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(401, "You are not logged in! Please log in to get access.")
      );
    }

    // 2) Verification token
    const decoded = verifyToken(token);

    // 3) Check if user still exists
    const currentUser = await Prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!currentUser) {
      return next(
        new AppError(
          401,
          "The user belonging to this token does no longer exist."
        )
      );
    }

    req.user = currentUser;

    next();
  }
);

// GRANT ACCESS TO PROTECTED ROUTE
export const Authorization = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "You have no access to this route"));
    }
    next();
  };
};
