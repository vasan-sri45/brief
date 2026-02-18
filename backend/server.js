import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/database.js";
import employeeAuthRouter from "./routes/auth/employee-route.js";
import userAuthRouter from "./routes/auth/user-route.js";
import userServiceRouter from "./routes/service/user-service.js";
import ticketRouter from "./routes/admin/ticket.route.js";
// import sellingRouter from "./routes/admin/sellingReport-route.js";
import serviceRoutes from "./routes/service/service.routes.js";
import BlogRoutes from "./routes/admin/blog.route.js";
import PaidServiceRoutes from "./routes/selling/paidService.route.js";
import paymentRoutes from "./routes/service/payment.routes.js";
import contactRouter from "./routes/service/contact.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";


const app = express();

const allowlist = ["https://brief-view.onrender.com",];

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Port = process.env.PORT || 4500;

app.set("trust proxy", 1);


// Mount under /api
app.use("/api", userAuthRouter);
app.use("/api", employeeAuthRouter);
app.use("/api/user", userServiceRouter);
app.use("/api/ticket", ticketRouter);
// app.use("/api/selling", sellingRouter);
app.use("/api/services", serviceRoutes);
app.use("/api",BlogRoutes);
app.use("/api/paid",PaidServiceRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api", contactRouter);

console.log("RESEND_API_KEY loaded?", !!process.env.RESEND_API_KEY);

// Express v5 catch‑all: use named wildcard, not "*"
app.all("/api/{*splat}", notFound);        // only for API paths
app.use(errorHandler);

app.listen(Port, () => {
  console.log(`server running at : ${Port}`);
  connectDB();
});
