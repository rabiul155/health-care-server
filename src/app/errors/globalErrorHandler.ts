import { ErrorRequestHandler, Response } from "express";

type ErrorType = {
  statusCode: number;
  status: "error";
  message: string;
  error?: any;
  stack?: any;
};

const sendErrorDev = (err: ErrorType, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: ErrorType, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Internal server error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;
