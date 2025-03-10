import { UserRole } from "@prisma/client";
import Prisma from "../../Prisma";
import { hashPassword } from "../../utils/AuthHelpers";
import { uploadFile } from "../../middleware/fileUploader";
import { paginateOrder, sanitizeSearchParam } from "../../utils/helpers";
import AppError from "../../utils/appError";

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

  const result = await Prisma.user.findMany({
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

  const total = await Prisma.user.count({
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

const createAdminDB = async (req: any) => {
  const data = req.body;
  const uploadImage: any = await uploadFile.uploadToCloudinary(req.file);

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
      data: { ...data.admin, profilePhoto: uploadImage.secure_url },
    });
    return { user: createUser, admin: createAdmin };
  });
  return result;
};

const createDoctorDB = async (req: any) => {
  const data = req.body;
  const uploadImage: any = await uploadFile.uploadToCloudinary(req.file);

  const hashPass = await hashPassword(data.password);

  const userData = {
    email: data.doctor.email,
    password: hashPass,
    role: UserRole.DOCTOR,
  };

  const result = await Prisma.$transaction(async (transaction) => {
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

const createPatientDB = async (req: any) => {
  const data = req.body;

  const uploadImage: any = await uploadFile.uploadToCloudinary(req.file);

  const hashPass = await hashPassword(data.password);

  const userData = {
    email: data.patient.email,
    password: hashPass,
    role: UserRole.PATIENT,
  };

  const result = await Prisma.$transaction(async (transaction) => {
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
  const result = await Prisma.user.update({
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
  const user = Prisma.user;
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

const updateMyProfile = async (user: any, req: any) => {
  if (req.file) {
    const uploadImage: any = await uploadFile.uploadToCloudinary(req.file);
    req.body.profilePhoto = uploadImage?.secure_url;
  }

  // function getTableModel(role: string) {
  //   const tables = {
  //     SUPER_ADMIN: Prisma.admin,
  //     ADMIN: Prisma.admin,
  //     DOCTOR: Prisma.doctor,
  //     PATIENT: Prisma.patient,
  //   } as const;
  //   return tables[role as keyof typeof tables]; // Ensure type safety
  // }

  // const TableModel = getTableModel(user.role as UserRole);

  // if (!TableModel) {
  //   throw new AppError(400, "Data doesn't match");
  // }

  let profileInfo;

  if (user.role === UserRole.SUPER_ADMIN) {
    profileInfo = await Prisma.admin.update({
      where: {
        email: user.email,
      },
      data: req.body,
    });
  } else if (user.role === UserRole.ADMIN) {
    profileInfo = await Prisma.admin.update({
      where: {
        email: user.email,
      },
      data: req.body,
    });
  } else if (user.role === UserRole.DOCTOR) {
    profileInfo = await Prisma.doctor.update({
      where: {
        email: user.email,
      },
      data: req.body,
    });
  } else if (user.role === UserRole.PATIENT) {
    profileInfo = await Prisma.patient.update({
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
