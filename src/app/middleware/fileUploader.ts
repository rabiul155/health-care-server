import multer from "multer";
import path from "path";
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

export const uploadFile = {
  uploadImage,
};
