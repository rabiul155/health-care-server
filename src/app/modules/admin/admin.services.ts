import { Admin, PrismaClient, UserStatus } from "@prisma/client";
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
  const { page, skip, limit, orderBy, order } = paginateOrder(params);

  const searchField = ["name", "email", "contactNo"];
  let whereCondition: any = { isDeleted: false };
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
  const total = await prisma.admin.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAdminDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAdminDB = async (
  id: string,
  data: Partial<Omit<Admin, "email">>
) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data: data,
  });
  return result;
};

const deleteAdminDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (adminDeletion) => {
    const deleteAdmin = adminDeletion.admin.delete({
      where: {
        id,
        isDeleted: false,
      },
    });
    const deleteUser = adminDeletion.user.delete({
      where: {
        id,
      },
    });
    return deleteAdmin;
  });
  return result;
};

const softDeleteAdminDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (adminDeletion) => {
    const deleteAdmin = adminDeletion.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const deleteUser = adminDeletion.user.update({
      where: {
        id,
      },
      data: {
        status: UserStatus.INACTIVE,
      },
    });
    return deleteAdmin;
  });
  return result;
};

export const adminServices = {
  getAllAdminDB,
  getAdminDB,
  updateAdminDB,
  deleteAdminDB,
  softDeleteAdminDB,
};
