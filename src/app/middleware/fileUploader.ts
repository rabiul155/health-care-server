import fs from "fs";
import path from "path";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import AppError from "../utils/appError";

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    // const extension = file.mimetype.split("/")[1];
    // cb(null, `user-${req.user._id}-${Date.now()}.${extension}`);
    cb(null, file.originalname);
  },
});

const multerFilter = function (req: any, file: any, cb: any) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only image can be uploaded"), false);
  }
};

const uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single("image");

async function uploadToCloudinary(file: any) {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_DOMAIN,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.originalname,
    })
    .catch((error) => {
      new AppError(400, "Upload image failed");
    });

  fs.unlinkSync(file.path);

  return uploadResult;
}

export const FileUploader = {
  uploadImage,
  uploadToCloudinary,
};
