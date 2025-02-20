import { PrismaClient, UserRole } from "@prisma/client";
import { UserDataType } from "./user.interface";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createAdminDB = async (data: UserDataType) => {
  const hashPass: string = await bcrypt.hash(data.password, 12);
  const userData = {
    email: data.admin.email,
    password: hashPass,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transaction) => {
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
  const result = await prisma.user.findMany({});
  return result;
};

export const userServices = {
  createAdminDB,
  getUserDB,
};
