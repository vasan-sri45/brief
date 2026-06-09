import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/utils/database.js";

import employeeAuthRouter from "./src/routes/auth/employee-route.js";
import userAuthRouter from "./src/routes/auth/user-route.js";
import userServiceRouter from "./src/routes/service/user-service.js";
import ticketRouter from "./src/routes/admin/ticket.route.js";
// import sellingRouter from "./src/routes/admin/sellingReport-route.js";
import serviceRoutes from "./src/routes/service/service.routes.js";
import BlogRoutes from "./src/routes/admin/blog.route.js";
import PaidServiceRoutes from "./src/routes/selling/paidService.route.js";
import paymentRoutes from "./src/routes/service/payment.routes.js";
import contactRouter from "./src/routes/service/contact.routes.js";
import healthRoutes from "./src/routes/health/health.route.js";
import exportRoutes from "./src/routes/service/export.routes.js";
import attendanceRoutes from "./src/routes/attendance/attendance-route.js";
import adminAttendanceRoutes from "./src/routes/attendance/adminAttendance-route.js";
import payrollRoutes from "./src/routes/payroll/payroll.route.js";
import employeeDetailRoutes from "./src/routes/auth/employeeDetails.route.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";


const app = express();

const allowlist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://briefcasse.com",
  "https://www.briefcasse.com",
  "https://admin-brief.onrender.com"
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowlist.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","x-client-code"],
  credentials: true,
  maxAge: 600,
};

app.use(cors(corsOptions));                 // handle CORS for all routes [web:219]
// app.options("/api/{*splat}", cors(corsOptions)); 

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const Port = process.env.PORT || 4500;

app.set("trust proxy", 1);


// Mount under /api
app.use("/api", healthRoutes);
app.use("/api", userAuthRouter);
app.use("/api", employeeAuthRouter);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminAttendanceRoutes);
app.use("/api/user", userServiceRouter);
app.use("/api/ticket", ticketRouter);
// app.use("/api/selling", sellingRouter);
app.use("/api/services", serviceRoutes);
app.use("/api",BlogRoutes);
app.use("/api/paid",PaidServiceRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", contactRouter);
app.use("/api", employeeDetailRoutes);
app.use("/api/export",exportRoutes);


console.log("RESEND_API_KEY loaded?", !!process.env.RESEND_API_KEY);

// Express v5 catch‑all: use named wildcard, not "*"
app.all("/api/{*splat}", notFound);        // only for API paths
app.use(errorHandler);

app.listen(Port, () => {
  console.log(`server running at : ${Port}`);
  connectDB();
});
