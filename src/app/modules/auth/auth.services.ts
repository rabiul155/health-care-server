import { UserStatus } from "@prisma/client";
import AppError from "../../utils/appError";
import Prisma from "../../Prisma";
import { JwtPayload } from "jsonwebtoken";
import { hashPassword, validatePassword } from "../../utils/AuthHelpers";

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

export const authServices = {
  loginUserDB,
  findUser,
  changePasswordDB,
};
