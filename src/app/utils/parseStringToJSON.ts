import { RequestHandler } from "express";

const parseStringToJSON: RequestHandler = (req, res, next) => {
  req.body = JSON.parse(req.body.data);
  next();
};

export default parseStringToJSON;
