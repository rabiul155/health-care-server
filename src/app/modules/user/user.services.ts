import { UserRole } from "@prisma/client";
import { UserDataType } from "./user.interface";
import Prisma from "../../Prisma";
import { hashPassword } from "../../utils/AuthHelpers";
import { uploadFile } from "../../middleware/fileUploader";

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

const getUserDB = async () => {
  const result = await Prisma.user.findMany({});
  return result;
};

export const userServices = {
  createAdminDB,
  createDoctorDB,
  getUserDB,
};
