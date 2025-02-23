import { PrismaClient } from "@prisma/client";
import { paginateOrder, sanitizeSearchParam } from "../../utils/helpers";

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
  const { skip, limit, orderBy, order } = paginateOrder(params);

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
    skip: skip,
    take: limit,
    orderBy: {
      [orderBy]: order,
    },
  });

  return result;
};

export const adminServices = {
  getAllAdminDB,
};
