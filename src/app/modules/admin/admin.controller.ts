import { Request, Response } from "express";
import { adminServices } from "./admin.services";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllAdminDB(req.query);
    res.status(200).json({
      success: true,
      message: "Admin found",
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

export const adminController = {
  getAllAdmin,
};
