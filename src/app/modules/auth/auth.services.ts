import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const loginUserDB = async (user: any) => {
  const result = await prisma.user.findMany({});
  console.log(result);
};
const getAllUserDB = async () => {
  const result = await prisma.user.findMany({});
  console.log(result);
};

export const authServices = {
  loginUserDB,
  getAllUserDB,
};
