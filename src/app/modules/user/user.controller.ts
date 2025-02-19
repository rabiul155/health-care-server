import { Request, Response } from "express";
import { userServices } from "./user.services";

const createAdmin = async (req: Request, res: Response) => {
  const result = await userServices.createAdminDB(req.body);
  res.status(200).send(result);
};
const getUser = async (req: Request, res: Response) => {
  const result = await userServices.getUserDB();
  res.status(200).send(result);
};

export const userController = {
  createAdmin,
  getUser,
};
