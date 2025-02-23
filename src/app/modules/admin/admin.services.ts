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
  const { page, limit } = sanitizeSearchParam(params, ["page", "limit"]);

  const searchField = ["name", "email", "contactNo"];
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
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return result;
};

export const adminServices = {
  getAllAdminDB,
};
