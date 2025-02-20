import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SearchParam = {
  search: string;
};

const getAllAdminDB = async (params: any) => {
  const searchField = ["name", "email"];
  let whereCondition = {};

  if (params.search) {
    whereCondition = {
      OR: searchField.map((field) => {
        return {
          [field]: { contains: params.search, mode: "insensitive" },
        };
      }),
    };
  }
  const result = await prisma.admin.findMany({
    where: whereCondition,
  });
  return result;
};

export const adminServices = {
  getAllAdminDB,
};
