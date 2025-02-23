import { PrismaClient } from "@prisma/client";
import { sanitizeSearchParam } from "../../utils/helpers";

const prisma = new PrismaClient();

type SearchParam = {
  search: string;
};

const getAllAdminDB = async (params: Record<string, unknown>) => {
  const { search, ...othersField } = sanitizeSearchParam(params, [
    "search",
    "contactNo",
    "name",
    "email",
  ]);

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

  const result = await prisma.admin.findMany({
    where: whereCondition,
  });

  return result;
};

export const adminServices = {
  getAllAdminDB,
};
