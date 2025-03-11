import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//Initialize the express app
const app = express();

//Import routes
import { userRoutes } from "./app/modules/user/user.routes";
import { adminRouter } from "./app/modules/admin/admin.routes";
import { authRouter } from "./app/modules/auth/auth.routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFoundRoute from "./app/middleware/notFoundRoute";
import { specialtiesRouter } from "./app/modules/specialties/specialties.services";

// middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the server" });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/specialties", specialtiesRouter);

//catch not found route
app.use("*", notFoundRoute);

//global error handler
app.use(globalErrorHandler);

export default app;
