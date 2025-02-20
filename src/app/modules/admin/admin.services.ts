import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SearchParam = {
  search: string;
};

const getAllAdminDB = async (params: any) => {
  const { search, ...othersField } = params;
  console.log(params);
  const searchField = ["name", "email"];
  let whereCondition: any = {};

  if (search) {
    whereCondition = {
      OR: searchField.map((field) => {
        return {
          [field]: { contains: search, mode: "insensitive" },
        };
      }),
    };
  }

  if (Object.keys(othersField).length > 0) {
    whereCondition.AND = [
      {
        ...othersField,
      },
    ];
  }

  console.dir(whereCondition, { depth: Infinity });

  const result = await prisma.admin.findMany({
    where: whereCondition,
  });

  return result;
};

export const adminServices = {
  getAllAdminDB,
};
