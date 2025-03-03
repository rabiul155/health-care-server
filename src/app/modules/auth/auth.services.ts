import { UserStatus } from "@prisma/client";
import AppError from "../../utils/appError";
import Prisma from "../../Prisma";
import { JwtPayload } from "jsonwebtoken";
import {
  createToken,
  hashPassword,
  validatePassword,
} from "../../utils/AuthHelpers";
import sendEmail from "../../utils/emailSender";

const loginUserDB = async (data: any) => {
  const result = await Prisma.user.findUnique({
    where: {
      email: data.email,
      // status: UserStatus.ACTIVE,
    },
  });

  if (!result) {
    throw new AppError(404, "User not found");
  }

  const isValidPass = await validatePassword(data.password, result.password);
  if (!isValidPass) {
    throw new AppError(404, "Wrong password");
  }

  return result;
};

const findUser = async (email: string) => {
  const result = await Prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });
  return result;
};

const changePasswordDB = async (user: JwtPayload, payload: any) => {
  const userDB = await Prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userDB) {
    throw new AppError(400, "User not exist");
  }

  const verifyPassword = validatePassword(
    payload.oldPassword,
    userDB?.password
  );

  if (!verifyPassword) {
    throw new AppError(400, "Wrong password");
  }

  const hashPass = await hashPassword(payload.newPassword);

  const result = await Prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashPass,
      needPasswordChange: false,
    },
  });
};

const forgotPassword = async (payload: any) => {
  const user = await Prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const token = createToken(payload.email, 5 * 60 * 1000);
  const link =
    process.env.RESET_PASSWORD_LINK + `?email=${user.email}&token=${token}`;

  const message = await sendEmail(user.email, "Reset password", link);

  return message;
};

export const authServices = {
  loginUserDB,
  findUser,
  changePasswordDB,
  forgotPassword,
};
