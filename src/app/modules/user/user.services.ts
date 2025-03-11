import { UserRole } from "@prisma/client";
import prisma from "../../Prisma";
import { hashPassword } from "../../utils/AuthHelpers";
import { FileUploader } from "../../middleware/fileUploader";
import { paginateOrder, sanitizeSearchParam } from "../../utils/helpers";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

const getUserDB = async (params: Record<string, unknown>) => {
  const { search, ...othersField } = sanitizeSearchParam(params, [
    "search",
    "email",
    "role",
    "status",
  ]);
  const { page, skip, limit, orderBy, order } = paginateOrder(params);

  console.log(params, search);

  const searchField = ["email"];

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

  // console.dir(whereCondition, { depth: Infinity });

  const result = await prisma.user.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [orderBy]: order,
    },
    select: {
      id: true,
      email: true,
      password: false,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      patient: true,
    },
    // include: {
    //   admin: true,
    //   doctor: true,
    //   patient: true,
    // },
  });

  const total = await prisma.user.count({
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

const createAdminDB = async (req: Request) => {
  const data = req.body;
  const uploadImage: any = await FileUploader.uploadToCloudinary(req.file);

  const hashPass = await hashPassword(data.password);

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
      data: { ...data.admin, profilePhoto: uploadImage.secure_url },
    });
    return { user: createUser, admin: createAdmin };
  });
  return result;
};

const createDoctorDB = async (req: Request) => {
  const data = req.body;
  const uploadImage: any = await FileUploader.uploadToCloudinary(req.file);

  const hashPass = await hashPassword(data.password);

  const userData = {
    email: data.doctor.email,
    password: hashPass,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transaction) => {
    const createUser = await transaction.user.create({
      data: userData,
    });

    const createDoctor = await transaction.doctor.create({
      data: { ...data.doctor, profilePhoto: uploadImage.secure_url },
    });
    return { user: createUser, doctor: createDoctor };
  });
  return result;
};

const createPatientDB = async (req: Request) => {
  const data = req.body;

  const uploadImage: any = await FileUploader.uploadToCloudinary(req.file);

  const hashPass = await hashPassword(data.password);

  const userData = {
    email: data.patient.email,
    password: hashPass,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transaction) => {
    const createUser = await transaction.user.create({
      data: userData,
    });

    const createPatient = await transaction.patient.create({
      data: { ...data.patient, profilePhoto: uploadImage.secure_url },
    });
    return { user: createUser, doctor: createPatient };
  });
  return result;
};

const updateUserStatusDB = async (id: string, body: any) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: body.status,
    },
  });
  return result;
};

const getMeDB = async (id: string, role: UserRole) => {
  const user = prisma.user;
  const result = await user.findUnique({
    where: {
      id: id,
    },
    omit: {
      password: true,
    },
    include: {
      admin: role === UserRole.ADMIN,
      doctor: role === UserRole.DOCTOR,
      patient: role === UserRole.PATIENT,
    },
  });
  return result;
};

const updateMyProfile = async (user: JwtPayload, req: Request) => {
  if (req?.file) {
    const uploadImage: any = await FileUploader.uploadToCloudinary(req.file);
    req.body.profilePhoto = uploadImage?.secure_url;
  }

  // function getTableModel(role: string) {
  //   const tables = {
  //     SUPER_ADMIN: prisma.admin,
  //     ADMIN: prisma.admin,
  //     DOCTOR: prisma.doctor,
  //     PATIENT: prisma.patient,
  //   } as const;
  //   return tables[role as keyof typeof tables]; // Ensure type safety
  // }

  // const TableModel = getTableModel(user.role as UserRole);

  // if (!TableModel) {
  //   throw new AppError(400, "Data doesn't match");
  // }

  let profileInfo;

  if (user.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: user.email,
      },
      data: req.body,
    });
  } else if (user.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: user.email,
      },
      data: req.body,
    });
  } else if (user.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: user.email,
      },
      data: req.body,
    });
  } else if (user.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: user.email,
      },
      data: req.body,
    });
  }

  return profileInfo;
};

export const userServices = {
  createAdminDB,
  createDoctorDB,
  createPatientDB,
  updateUserStatusDB,
  updateMyProfile,
  getUserDB,
  getMeDB,
};
