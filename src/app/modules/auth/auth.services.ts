import { UserStatus } from "@prisma/client";
import validatePassword from "../../utils/validatePassword";
import AppError from "../../utils/appError";
import Prisma from "../../Prisma";

const loginUserDB = async (data: any) => {
  const result = await Prisma.user.findUnique({
    where: {
      email: data.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!result) {
    throw new AppError(404, "User not found");
  }

  const isValidPass = await validatePassword(data.password, result.password);
  if (!isValidPass) {
    throw new AppError(404, "User not found");
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
export const authServices = {
  loginUserDB,
  findUser,
};
