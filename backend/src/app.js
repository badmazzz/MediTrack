import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/inventory", inventoryRouter);


export default app;
