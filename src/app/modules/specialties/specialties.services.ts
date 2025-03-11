import { Request } from "express";
import Prisma from "../../Prisma";
import { FileUploader } from "../../middleware/fileUploader";

const createSpecialties = async (req: Request) => {
  if (req.file) {
    const uploadedImage: any = await FileUploader.uploadToCloudinary(req.file);
    req.body.icon = uploadedImage.secure_url;
  }
  const result = await Prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getSpecialties = async () => {
  const result = await Prisma.specialties.findMany({});
  return result;
};

export const specialtiesServices = {
  createSpecialties,
  getSpecialties,
};
