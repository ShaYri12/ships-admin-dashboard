import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import User from "./models/user.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

// Function to initialize default admin
const initializeDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      email: "admin@ships.com",
      role: "admin",
    });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      const admin = new User({
        name: "admin",
        email: "admin@ships.com",
        password: hashedPassword,
        role: "admin",
        status: "active",
        createdBy: null, // First admin
      });

      await admin.save();
      console.log("Default admin created successfully");
    } else {
      console.log("Default admin already exists");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Initialize default admin after connection
    await initializeDefaultAdmin();

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
