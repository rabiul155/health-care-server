import { Request, Response } from "express";
import { userServices } from "./user.services";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdminDB(req.body);
    res.status(200).json({
      success: true,
      message: "Admin created",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
      error: err,
    });
  }
};
const getUser = async (req: Request, res: Response) => {
  const result = await userServices.getUserDB();
  res.status(200).send(result);
};

export const userController = {
  createAdmin,
  getUser,
};
