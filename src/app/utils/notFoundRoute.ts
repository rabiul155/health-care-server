import { RequestHandler } from "express";

const notFoundRoute: RequestHandler = (req, res, next) => {
  res.status(400).json({
    success: false,
    message: "Route not found",
  });
};

export default notFoundRoute;
