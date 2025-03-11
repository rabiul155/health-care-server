import { Request } from "express";
import Prisma from "../../Prisma";

const createSpecialties = async (req: Request) => {
  const result = await Prisma.specialties.create({
    data: req.body,
  });

  return result;
};

export const specialtiesServices = {
  createSpecialties,
};
