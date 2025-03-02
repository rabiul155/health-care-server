import { UserRole } from "@prisma/client";
import { UserDataType } from "./user.interface";
import bcrypt from "bcrypt";
import Prisma from "../../Prisma";
import { hashPassword } from "../../utils/AuthHelpers";

const createAdminDB = async (data: UserDataType) => {
  const hashPass = await hashPassword(data.password);
  const userData = {
    email: data.admin.email,
    password: hashPass,
    role: UserRole.ADMIN,
  };

  const result = await Prisma.$transaction(async (transaction) => {
    const createUser = await transaction.user.create({
      data: userData,
    });
    const createAdmin = await transaction.admin.create({
      data: data.admin,
    });

    return { user: createUser, admin: createAdmin };
  });
  return result;
};

const getUserDB = async () => {
  const result = await Prisma.user.findMany({});
  return result;
};

export const userServices = {
  createAdminDB,
  getUserDB,
};
