import { Doctor, UserStatus } from "@prisma/client";
import prisma from "../../Prisma";

const getDoctorFormDB = async () => {
  const result = await prisma.doctor.findMany({});

  return result;
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // update doctor
  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    const addSpecialties: any[] = [];
    const deleteSpecialties: any[] = [];

    specialties.forEach((specialty: any) => {
      if (specialty.isDeleted === false) {
        addSpecialties.push({
          specialtiesId: specialty.id,
          doctorId: doctorData.id,
        });
      } else {
        deleteSpecialties.push({
          doctorId: doctorData.id,
          specialtiesId: specialty.id,
        });
      }
    });

    await transactionClient.doctorSpecialties.createMany({
      data: addSpecialties,
    });
    for (const del of deleteSpecialties) {
      await transactionClient.doctorSpecialties.deleteMany({
        where: {
          doctorId: del.doctorId,
          specialtiesId: del.specialtiesId,
        },
      });
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.INACTIVE,
      },
    });

    return deleteDoctor;
  });
};

export const DoctorService = {
  updateIntoDB,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
  getDoctorFormDB,
};
